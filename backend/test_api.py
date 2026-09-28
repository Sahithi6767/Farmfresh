import unittest
import json
from app import create_app
from app.database import db
from app.config import Config
from app.models.user import User
from app.models.product import Product
from app.models.cart import CartItem
from app.models.order import Order

class TestConfig(Config):
    # Use SQLite memory database for clean, isolated test runs
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    TESTING = True

class FarmFreshAPITestCase(unittest.TestCase):
    def setUp(self):
        """Set up test application client and mock database"""
        self.app = create_app(TestConfig)
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()
        
        # Build tables
        db.create_all()

    def tearDown(self):
        """Clean database and pop application context"""
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    def test_auth_registration_validation(self):
        """Verify registration validations and password length blocks"""
        # Test empty request
        resp = self.client.post('/api/auth/register', json={})
        self.assertEqual(resp.status_code, 400)
        
        # Test short password
        resp = self.client.post('/api/auth/register', json={
            'name': 'Rohan Sharma',
            'email': 'rohan@gmail.com',
            'password': '123',
            'role': 'customer'
        })
        self.assertEqual(resp.status_code, 400)
        data = json.loads(resp.data)
        self.assertIn('password', data['errors'])

    def test_complete_api_lifecycle(self):
        """Test full system lifecycle: registration, catalog edits, cart additions and checkouts"""
        
        # 1. Register Customer
        customer_reg = self.client.post('/api/auth/register', json={
            'name': 'Rohan Sharma',
            'email': 'rohan@gmail.com',
            'password': 'password123',
            'role': 'customer',
            'phone': '+91 98765 43210',
            'address': 'Bengaluru, India'
        })
        self.assertEqual(customer_reg.status_code, 201)
        customer_data = json.loads(customer_reg.data)
        customer_token = customer_data['token']
        customer_id = customer_data['user']['id']

        # 2. Register Farmer
        farmer_reg = self.client.post('/api/auth/register', json={
            'name': 'Thirupathi Reddy',
            'email': 'thirupathi@reddyfarms.com',
            'password': 'password123',
            'role': 'farmer',
            'farm_name': 'Reddy Organic Farms',
            'farm_location': 'Bhupathipur, Jagtial, Telangana',
            'farm_story': 'Sustainable 25-acre farm.'
        })
        self.assertEqual(farmer_reg.status_code, 201)
        farmer_data = json.loads(farmer_reg.data)
        farmer_token = farmer_data['token']
        farmer_id = farmer_data['user']['id']

        # Verify initial balance
        self.assertEqual(farmer_data['user']['balance'], 0.0)

        # 3. Farmer lists a new crop product
        headers = {'Authorization': f'Bearer {farmer_token}'}
        add_prod = self.client.post('/api/products/', json={
            'name': 'Pure Turmeric Powder',
            'category': 'Spices & Turmeric',
            'price': 200,
            'originalPrice': 250,
            'unit': '500g Pack',
            'stock': 50,
            'description': 'Hand-picked organic turmeric.'
        }, headers=headers)
        self.assertEqual(add_prod.status_code, 201)
        prod_id = json.loads(add_prod.data)['product']['id']

        # Verify crop retrieval (public)
        get_catalog = self.client.get('/api/products/')
        self.assertEqual(get_catalog.status_code, 200)
        catalog_items = json.loads(get_catalog.data)
        self.assertEqual(len(catalog_items), 1)
        self.assertEqual(catalog_items[0]['name'], 'Pure Turmeric Powder')

        # 4. Farmer edits the crop details (price and stock)
        edit_prod = self.client.put(f'/api/products/{prod_id}', json={
            'price': 180,
            'stock': 60
        }, headers=headers)
        self.assertEqual(edit_prod.status_code, 200)
        edited_item = json.loads(edit_prod.data)['product']
        self.assertEqual(edited_item['price'], 180)
        self.assertEqual(edited_item['stock'], 60)

        # 5. Customer adds the crop product to cart
        cust_headers = {'Authorization': f'Bearer {customer_token}'}
        add_cart = self.client.post('/api/cart/', json={
            'product_id': prod_id,
            'quantity': 2
        }, headers=cust_headers)
        self.assertEqual(add_cart.status_code, 200)
        
        # Verify cart list
        get_cart = self.client.get('/api/cart/', headers=cust_headers)
        self.assertEqual(get_cart.status_code, 200)
        cart_list = json.loads(get_cart.data)
        self.assertEqual(len(cart_list), 1)
        self.assertEqual(cart_list[0]['quantity'], 2)

        # 6. Customer checkout (places order)
        checkout = self.client.post('/api/orders/', json={
            'deliveryFee': 40,
            'farmerContribution': 0,
            'address': 'Bengaluru Green Glen Layout'
        }, headers=cust_headers)
        self.assertEqual(checkout.status_code, 201)
        checkout_data = json.loads(checkout.data)
        order_id = checkout_data['order']['id']

        # Assert wallet deduction (Initial: 1000, Purchase: 180*2=360, Fee: 40. Remaining: 600)
        self.assertEqual(checkout_data['wallet_balance'], 600.0)

        # Assert crop stock reduction (Initially 60, bought 2, remaining 58)
        self.assertEqual(Product.query.get(prod_id).stock, 58)

        # Assert farmer earnings balance increase (Farmer Reddy gets 180 * 2 = 360)
        self.assertEqual(User.query.get(farmer_id).balance, 360.0)

        # 7. Farmer advances order fulfillment status
        update_ord = self.client.put(f'/api/orders/{order_id}/status', json={
            'status': 'Harvesting'
        }, headers=headers)
        self.assertEqual(update_ord.status_code, 200)
        self.assertEqual(json.loads(update_ord.data)['order']['status'], 'Harvesting')

    def test_razorpay_payment_integration(self):
        """Verify Razorpay order initialization and signature verification endpoints"""
        
        # 1. Register Customer & Farmer
        customer_reg = self.client.post('/api/auth/register', json={
            'name': 'Amit Kumar',
            'email': 'amit@gmail.com',
            'password': 'password123',
            'role': 'customer'
        })
        customer_token = json.loads(customer_reg.data)['token']
        
        farmer_reg = self.client.post('/api/auth/register', json={
            'name': 'Ramesh Kumar',
            'email': 'ramesh@gmail.com',
            'password': 'password123',
            'role': 'farmer',
            'farm_name': 'Ramesh Farms',
            'farm_location': 'Bhupathipur, Jagtial, Telangana',
            'farm_story': 'Organic paddy farm.'
        })
        farmer_token = json.loads(farmer_reg.data)['token']
        
        # 2. Farmer lists product
        add_prod = self.client.post('/api/products/', json={
            'name': 'Aged Brown Rice',
            'category': 'Grains',
            'price': 100,
            'originalPrice': 120,
            'unit': '1 kg',
            'stock': 10,
            'description': 'Aged healthy brown rice.'
        }, headers={'Authorization': f'Bearer {farmer_token}'})
        prod_id = json.loads(add_prod.data)['product']['id']
        
        # 3. Add to cart
        cust_headers = {'Authorization': f'Bearer {customer_token}'}
        self.client.post('/api/cart/', json={'product_id': prod_id, 'quantity': 1}, headers=cust_headers)
        
        # 4. Initiate Razorpay Order
        order_res = self.client.post('/api/payments/razorpay/order', json={
            'deliveryFee': 39,
            'farmerContribution': 10
        }, headers=cust_headers)
        self.assertEqual(order_res.status_code, 200)
        order_data = json.loads(order_res.data)
        self.assertIn('razorpay_order_id', order_data)
        self.assertEqual(order_data['grand_total_inr'], 149.0) # 100 + 39 + 10
        
        # 5. Verify payment signature (mocked)
        verify_res = self.client.post('/api/payments/razorpay/verify', json={
            'razorpay_order_id': order_data['razorpay_order_id'],
            'razorpay_payment_id': 'pay_MOCK123456',
            'razorpay_signature': 'mock_signature_abcde',
            'deliveryFee': 39,
            'farmerContribution': 10,
            'address': 'Whitefield, Bengaluru'
        }, headers=cust_headers)
        self.assertEqual(verify_res.status_code, 201)
        verify_data = json.loads(verify_res.data)
        self.assertIn('order', verify_data)
        self.assertEqual(verify_data['order']['grandTotal'], 149.0)

if __name__ == '__main__':
    unittest.main()
