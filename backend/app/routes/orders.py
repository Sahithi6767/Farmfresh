import random
import uuid
from flask import Blueprint, request, jsonify, g
from app.database import db
from app.models.order import Order, OrderItem
from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.models.payment import Payment
from app.models.user import User
from app.services.auth_service import token_required, farmer_required

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/farmer-summary', methods=['GET'])
@token_required
@farmer_required
def get_farmer_summary():
    """Retrieve farmer dashboard metrics strictly scoped to g.current_user.id"""
    farmer_id = g.current_user.id

    farmer_order_items = OrderItem.query.join(Product).filter(
        Product.farmer_id == farmer_id
    ).all()

    total_earnings = sum(item.price * item.quantity for item in farmer_order_items)
    pending_harvests = sum(1 for item in farmer_order_items if item.order.status in ['Placed', 'Harvesting'])

    orders_map = {}
    for item in farmer_order_items:
        ord_obj = item.order
        if ord_obj.id not in orders_map:
            orders_map[ord_obj.id] = {
                'id': ord_obj.id,
                'date': ord_obj.date.strftime('%b %d, %Y'),
                'customerName': ord_obj.customer.name if ord_obj.customer else 'Customer',
                'status': ord_obj.status,
                'address': ord_obj.address,
                'items': [],
                'farmerSubtotal': 0.0
            }
        orders_map[ord_obj.id]['items'].append(item.to_json())
        orders_map[ord_obj.id]['farmerSubtotal'] += item.price * item.quantity

    return jsonify({
        'total_earnings': total_earnings,
        'pending_harvests': pending_harvests,
        'orders': list(orders_map.values())
    }), 200


@orders_bp.route('/', methods=['POST'])
@token_required
def place_order():
    """Checkout cart items, deduct wallet credits, and trigger order & payment logs"""
    user = g.current_user
    
    if user.role != 'customer':
        return jsonify({'message': 'Only customer accounts can place orders.'}), 403

    user_cart = Cart.query.filter_by(user_id=user.id).first()
    cart_items = CartItem.query.filter_by(cart_id=user_cart.id).all() if user_cart else []
    
    if not cart_items:
        return jsonify({'message': 'Your shopping cart is empty.'}), 400

    data = request.get_json() or {}
    
    # Calculate costs
    delivery_fee = float(data.get('deliveryFee', 40.0))
    farmer_contribution = float(data.get('farmerContribution', 0.0))
    
    total_amount = sum(item.product.price * item.quantity for item in cart_items)
    grand_total = total_amount + delivery_fee + farmer_contribution

    # Check customer wallet funds
    if user.wallet_balance < grand_total:
        return jsonify({
            'message': f'Insufficient wallet balance. Grand Total: ₹{grand_total}, Wallet: ₹{user.wallet_balance}. Please add funds.'
        }), 400

    # Verify stock levels
    for item in cart_items:
        if item.product.stock < item.quantity:
            return jsonify({
                'message': f'Insufficient inventory for {item.product.name}. Only {item.product.stock} units left.'
            }), 400

    try:
        # Create Order Header
        order_id = f"ORD-{random.randint(10000, 99999)}"
        new_order = Order(
            id=order_id,
            customer_id=user.id,
            total_amount=total_amount,
            delivery_fee=delivery_fee,
            farmer_contribution=farmer_contribution,
            grand_total=grand_total,
            status='Placed',
            address=data.get('address', user.address or 'Standard Delivery'),
            payment_method='FarmFresh Wallet'
        )
        db.session.add(new_order)

        # Loop to create items, adjust stocks and distribute farmer earnings
        for item in cart_items:
            prod = item.product
            
            order_item = OrderItem(
                order_id=order_id,
                product_id=prod.id,
                name=prod.name,
                price=prod.price,
                quantity=item.quantity,
                unit=prod.unit,
                farmer_name=prod.farmer.name if prod.farmer else 'Thirupathi Reddy',
                image=prod.image
            )
            db.session.add(order_item)

            # Reduce product stock
            prod.stock -= item.quantity
            
            # Distribute earnings
            if prod.farmer:
                earnings = prod.price * item.quantity
                prod.farmer.balance = (prod.farmer.balance or 0.0) + earnings

        # Deduct wallet
        user.wallet_balance -= grand_total

        # Create Normalized Payment Record
        txn_id = f"TXN-{uuid.uuid4().hex[:12].upper()}"
        new_payment = Payment(
            order_id=order_id,
            customer_id=user.id,
            amount=grand_total,
            status='Completed',
            payment_method='FarmFresh Wallet',
            transaction_id=txn_id
        )
        db.session.add(new_payment)

        # Clear cart items
        for item in cart_items:
            db.session.delete(item)

        db.session.commit()
        return jsonify({
            'message': 'Order placed successfully!',
            'order': new_order.to_json(),
            'wallet_balance': user.wallet_balance
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Checkout error.', 'error': str(e)}), 500


@orders_bp.route('/<string:order_id>/status', methods=['PUT'])
@token_required
@farmer_required
def update_status(order_id):
    """Advance dispatch timelines for orders containing farmer products"""
    order = Order.query.get_or_404(order_id)
    data = request.get_json() or {}
    new_status = data.get('status')

    allowed_statuses = ['Placed', 'Harvesting', 'Ready to Dispatch', 'Out for Delivery', 'Delivered']
    if not new_status or new_status not in allowed_statuses:
        return jsonify({'message': f'Status must be one of: {", ".join(allowed_statuses)}'}), 400

    order_contains_farmer_product = any(
        item.product and item.product.farmer_id == g.current_user.id for item in order.items
    )
    if not order_contains_farmer_product:
        return jsonify({'message': 'Access denied. You do not own any products in this order!'}), 403

    try:
        order.status = new_status
        db.session.commit()
        return jsonify({
            'message': 'Fulfillment status updated successfully.',
            'order': order.to_json()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error updating status.', 'error': str(e)}), 500
