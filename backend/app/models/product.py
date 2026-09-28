from datetime import datetime
from app.database import db

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    
    # Normalized relationship
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id', ondelete='RESTRICT'), nullable=False, index=True)
    
    price = db.Column(db.Float, nullable=False)
    original_price = db.Column(db.Float, nullable=True)
    unit = db.Column(db.String(50), nullable=False, default='1 kg')
    rating = db.Column(db.Float, default=4.8)
    reviews_count = db.Column(db.Integer, default=1)
    image = db.Column(db.String(255), nullable=False)
    organic = db.Column(db.Boolean, default=True)
    bestseller = db.Column(db.Boolean, default=False)
    
    tags = db.Column(db.JSON, nullable=True, default=list) 
    nutrients = db.Column(db.JSON, nullable=True, default=dict)
    
    harvest_date = db.Column(db.String(50), nullable=True)
    shelf_life_days = db.Column(db.Integer, default=30)
    stock = db.Column(db.Integer, default=50)
    description = db.Column(db.Text, nullable=False)
    
    farmer_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    cart_items = db.relationship('CartItem', backref='product', lazy=True, cascade="all, delete-orphan")
    order_items = db.relationship('OrderItem', backref='product', lazy=True)

    def to_json(self):
        farmer_data = {
            'name': self.farmer.name,
            'farmName': self.farmer.farm_name,
            'location': self.farmer.farm_location,
            'distanceKm': self.farmer.distance_km,
            'rating': 5.0,
            'avatar': self.farmer.avatar,
            'story': self.farmer.farm_story
        } if self.farmer else {}

        return {
            'id': self.id,
            'name': self.name,
            
            # API expects category as string name
            'category': self.category_rel.name if self.category_rel else None,
            'category_id': self.category_id,
            
            'price': self.price,
            'originalPrice': self.original_price,
            'unit': self.unit,
            'rating': self.rating,
            'reviewsCount': self.reviews_count,
            'image': self.image,
            'organic': self.organic,
            'bestseller': self.bestseller,
            'tags': self.tags or [],
            'nutrients': self.nutrients or {},
            'harvestDate': self.harvest_date,
            'shelfLifeDays': self.shelf_life_days,
            'stock': self.stock,
            'description': self.description,
            'farmer': farmer_data,
            'created_at': self.created_at.isoformat()
        }
