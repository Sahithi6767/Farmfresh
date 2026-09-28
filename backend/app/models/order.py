from datetime import datetime
from app.database import db

class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.String(50), primary_key=True) # e.g. ORD-XXXXX pattern
    date = db.Column(db.DateTime, default=datetime.utcnow)
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    total_amount = db.Column(db.Float, nullable=False)
    delivery_fee = db.Column(db.Float, default=40.0)
    farmer_contribution = db.Column(db.Float, default=0.0)
    grand_total = db.Column(db.Float, nullable=False)
    
    status = db.Column(db.String(50), default='Placed', nullable=False) # Placed, Harvesting, Ready to Dispatch, Out for Delivery, Delivered
    address = db.Column(db.Text, nullable=False)
    payment_method = db.Column(db.String(50), default='FarmFresh Wallet')
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    items = db.relationship('OrderItem', backref='order', lazy=True, cascade="all, delete-orphan")
    
    # 1-to-1 relationship with Payment log
    payment = db.relationship('Payment', backref='order_rel', uselist=False, lazy=True, cascade="all, delete-orphan")

    def to_json(self):
        return {
            'id': self.id,
            'date': self.date.strftime('%b %d, %Y'),
            'customerName': self.customer.name if self.customer else 'Rohan Sharma',
            'customerId': self.customer_id,
            'items': [item.to_json() for item in self.items],
            'totalAmount': self.total_amount,
            'deliveryFee': self.delivery_fee,
            'farmerContribution': self.farmer_contribution,
            'grandTotal': self.grand_total,
            'status': self.status,
            'address': self.address,
            'paymentMethod': self.payment_method,
            'payment_status': self.payment.status if self.payment else 'Unpaid',
            'transaction_id': self.payment.transaction_id if self.payment else None,
            'created_at': self.created_at.isoformat()
        }

class OrderItem(db.Model):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.String(50), db.ForeignKey('orders.id', ondelete='CASCADE'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=True) # Nullable if product is deleted
    
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit = db.Column(db.String(50), nullable=False)
    farmer_name = db.Column(db.String(100), nullable=False)
    image = db.Column(db.String(255), nullable=True)

    def to_json(self):
        return {
            'name': self.name,
            'price': self.price,
            'quantity': self.quantity,
            'unit': self.unit,
            'farmerName': self.farmer_name,
            'image': self.image
        }
