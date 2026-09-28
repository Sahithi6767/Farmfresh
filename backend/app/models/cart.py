from datetime import datetime
from app.database import db

class Cart(db.Model):
    __tablename__ = 'carts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, unique=True, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    items = db.relationship('CartItem', backref='cart', lazy=True, cascade="all, delete-orphan")

    def to_json(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'items': [item.to_json() for item in self.items]
        }

class CartItem(db.Model):
    __tablename__ = 'cart_items'

    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('carts.id', ondelete='CASCADE'), nullable=False, index=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id', ondelete='CASCADE'), nullable=False)
    quantity = db.Column(db.Integer, default=1, nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_json(self):
        prod = self.product
        return {
            'id': prod.id, 
            'cart_item_id': self.id,
            'name': prod.name,
            'price': prod.price,
            'originalPrice': prod.original_price,
            'unit': prod.unit,
            'quantity': self.quantity,
            'image': prod.image,
            'farmerName': prod.farmer.name if prod.farmer else 'Thirupathi Reddy',
            'farmName': prod.farmer.farm_name if prod.farmer else 'Reddy Organic Farms',
            'stock': prod.stock
        }
