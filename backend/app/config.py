import os
from dotenv import load_dotenv

# Load local environment configuration
load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', '9ef87b32c613ad45efb02d8471')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'e8c0e81dbd93ac41f7e028b17a')
    
    # Database Configuration: support Postgresql primarily, fallback to SQLite
    DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:///farmfresh.db')
    
    # SQLAlchemy requires postgresql:// instead of postgres:// for Postgres 10+ compatibility
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
        
    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Image upload configuration
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', os.path.join(os.path.abspath(os.path.dirname(__file__)), 'static', 'uploads'))
    MAX_CONTENT_LENGTH = int(os.environ.get('MAX_CONTENT_LENGTH', 16 * 1024 * 1024)) # default 16MB
    
    # Allow uploads to be saved inside static directory
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

    # Razorpay API configs
    RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', 'rzp_test_DUMMY_KEY_ID_123')
    RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', 'rzp_test_DUMMY_SECRET_456')
