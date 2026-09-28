import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from app.config import Config
from app.database import db

def create_app(config_class=Config):
    """Flask Application Factory Builder"""
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Enable Cross-Origin Resource Sharing (CORS) for React integration
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Bind SQLAlchemy Engine
    db.init_app(app)

    # Register blueprints (routes)
    from app.routes.auth import auth_bp
    from app.routes.products import products_bp
    from app.routes.cart import cart_bp
    from app.routes.orders import orders_bp
    from app.routes.upload import upload_bp
    from app.routes.payments import payments_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(cart_bp, url_prefix='/api/cart')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    app.register_blueprint(upload_bp, url_prefix='/api/upload')
    app.register_blueprint(payments_bp, url_prefix='/api/payments')

    # Serve uploaded images statically
    @app.route('/static/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    # Global check endpoint
    @app.route('/health', methods=['GET'])
    def health():
        return {'status': 'healthy', 'database': app.config['SQLALCHEMY_DATABASE_URI'].split('://')[0]}, 200

    return app
