from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app.database import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='customer', nullable=False) # 'customer' or 'farmer'
    
    # Customer specific fields
    wallet_balance = db.Column(db.Float, default=1000.0)
    address = db.Column(db.Text, nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    
    # Farmer specific fields
    farm_name = db.Column(db.String(120), nullable=True)
    farm_location = db.Column(db.String(120), nullable=True)
    farm_story = db.Column(db.Text, nullable=True)
    distance_km = db.Column(db.Integer, default=38)
    avatar = db.Column(db.String(255), nullable=True)
    balance = db.Column(db.Float, default=0.0)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    products = db.relationship('Product', backref='farmer', lazy=True, cascade="all, delete-orphan")
    orders = db.relationship('Order', backref='customer', lazy=True)
    
    # 1-to-1 relationship with Cart header
    cart = db.relationship('Cart', backref='user', uselist=False, lazy=True, cascade="all, delete-orphan")
    payments = db.relationship('Payment', backref='customer', lazy=True)

    @property
    def full_name(self):
        return self.name

    @full_name.setter
    def full_name(self, value):
        self.name = value

    @property
    def location(self):
        return self.farm_location

    @location.setter
    def location(self, value):
        self.farm_location = value

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        if not self.password_hash:
            return False
        return check_password_hash(self.password_hash, password)

    def to_json(self):
        data = {
            'id': self.id,
            'name': self.name,
            'full_name': self.name,
            'email': self.email,
            'role': self.role,
            'phone': self.phone,
            'address': self.address,
            'created_at': self.created_at.isoformat()
        }
        
        if self.role == 'customer':
            data['wallet_balance'] = self.wallet_balance
            
        elif self.role == 'farmer':
            data['farm_name'] = self.farm_name
            data['farm_location'] = self.farm_location
            data['location'] = self.farm_location
            data['farm_story'] = self.farm_story
            data['distance_km'] = self.distance_km
            data['avatar'] = self.avatar
            data['balance'] = self.balance
            
        return data

