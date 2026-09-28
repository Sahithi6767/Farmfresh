from flask import Blueprint, request, jsonify, g
from app.database import db
from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.services.auth_service import token_required

cart_bp = Blueprint('cart', __name__)

def get_or_create_user_cart(user_id):
    """Retrieve or create user Cart header"""
    user_cart = Cart.query.filter_by(user_id=user_id).first()
    if not user_cart:
        user_cart = Cart(user_id=user_id)
        db.session.add(user_cart)
        db.session.commit()
    return user_cart

@cart_bp.route('/', methods=['GET'])
@token_required
def get_cart():
    """Retrieve authenticated user's cart items"""
    user_cart = get_or_create_user_cart(g.current_user.id)
    items = CartItem.query.filter_by(cart_id=user_cart.id).all()
    return jsonify([item.to_json() for item in items]), 200


@cart_bp.route('/', methods=['POST'])
@token_required
def add_to_cart():
    """Add product to cart or increment quantity"""
    data = request.get_json() or {}
    product_id = data.get('product_id')
    quantity = int(data.get('quantity', 1))

    if not product_id:
        return jsonify({'message': 'product_id parameter is required.'}), 400

    product = Product.query.get_or_404(product_id)
    
    # Verify stock limits
    if product.stock < quantity:
        return jsonify({'message': f'Insufficient stock. Only {product.stock} units remaining.'}), 400

    user_cart = get_or_create_user_cart(g.current_user.id)

    # Check if item already exists in user's cart
    existing_item = CartItem.query.filter_by(
        cart_id=user_cart.id,
        product_id=product_id
    ).first()

    try:
        if existing_item:
            existing_item.quantity += quantity
        else:
            new_item = CartItem(
                cart_id=user_cart.id,
                product_id=product_id,
                quantity=quantity
            )
            db.session.add(new_item)
            
        db.session.commit()
        
        # return updated cart list
        updated_items = CartItem.query.filter_by(cart_id=user_cart.id).all()
        return jsonify({
            'message': 'Cart updated successfully.',
            'cart': [item.to_json() for item in updated_items]
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error updating cart.', 'error': str(e)}), 500


@cart_bp.route('/<int:product_id>', methods=['PUT'])
@token_required
def update_cart_quantity(product_id):
    """Set product quantity to a specific count"""
    data = request.get_json() or {}
    quantity = int(data.get('quantity', 1))

    if quantity < 0:
        return jsonify({'message': 'Quantity must be at least 0.'}), 400

    product = Product.query.get_or_404(product_id)
    user_cart = get_or_create_user_cart(g.current_user.id)
    
    # Check item exists in cart
    cart_item = CartItem.query.filter_by(
        cart_id=user_cart.id,
        product_id=product_id
    ).first()

    if not cart_item:
        return jsonify({'message': 'Item not found in your cart.'}), 404

    try:
        if quantity == 0:
            db.session.delete(cart_item)
        else:
            if product.stock < quantity:
                return jsonify({'message': f'Cannot update. Only {product.stock} units in stock.'}), 400
            cart_item.quantity = quantity
            
        db.session.commit()
        
        updated_items = CartItem.query.filter_by(cart_id=user_cart.id).all()
        return jsonify({
            'message': 'Cart quantity modified.',
            'cart': [item.to_json() for item in updated_items]
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error updating cart.', 'error': str(e)}), 500


@cart_bp.route('/<int:product_id>', methods=['DELETE'])
@token_required
def delete_from_cart(product_id):
    """Remove product completely from cart"""
    user_cart = get_or_create_user_cart(g.current_user.id)
    
    cart_item = CartItem.query.filter_by(
        cart_id=user_cart.id,
        product_id=product_id
    ).first()

    if not cart_item:
        return jsonify({'message': 'Item not found in your cart.'}), 404

    try:
        db.session.delete(cart_item)
        db.session.commit()
        
        updated_items = CartItem.query.filter_by(cart_id=user_cart.id).all()
        return jsonify({
            'message': 'Item removed from cart.',
            'cart': [item.to_json() for item in updated_items]
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error deleting item.', 'error': str(e)}), 500
