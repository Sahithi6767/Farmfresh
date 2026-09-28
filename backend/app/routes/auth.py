from flask import Blueprint, request, jsonify, g
from app.database import db
from app.models.user import User
from app.services.auth_service import token_required, AuthService
from app.schemas.validation import Validator

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    
    # 1. Validation check
    validation_errors = Validator.validate_registration(data)
    if validation_errors:
        return jsonify({'errors': validation_errors}), 400

    email = data['email'].strip().lower()

    # 2. Check if email already exists
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email address already registered.'}), 400

    try:
        user_name = (data.get('name') or data.get('full_name') or '').strip()
        role = data.get('role', 'customer')
        
        # 3. Create user instance
        new_user = User(
            name=user_name,
            email=email,
            role=role,
            phone=data.get('phone', '').strip(),
            address=data.get('address', '').strip(),
            wallet_balance=1000.0 if role == 'customer' else 0.0
        )
        
        # Add farmer specific details
        if role == 'farmer':
            new_user.farm_name = data.get('farm_name', '').strip()
            farm_loc = (data.get('farm_location') or data.get('location') or '').strip()
            new_user.farm_location = farm_loc
            new_user.farm_story = data.get('farm_story', '').strip()
            new_user.avatar = data.get('avatar', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150')
            new_user.distance_km = int(data.get('distance_km', 38))

        # Set password hash using werkzeug.security
        new_user.set_password(data['password'])
        db.session.add(new_user)
        db.session.commit()

        # Import and create Cart instance
        from app.models.cart import Cart
        new_cart = Cart(user_id=new_user.id)
        db.session.add(new_cart)
        db.session.commit()

        # 4. Generate access token
        token = AuthService.encode_auth_token(new_user.id, new_user.role)
        
        return jsonify({
            'message': 'Account registered successfully!',
            'token': token,
            'user': new_user.to_json()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Internal registration error.', 'error': str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    requested_role = data.get('role')

    if not email or not password:
        return jsonify({'message': 'Email and Password are required.'}), 400

    # Look up user by email
    user = User.query.filter_by(email=email).first()
    
    if not user:
        return jsonify({'message': 'Invalid email or password.'}), 401

    # Check password hash (werkzeug.security)
    if not user.check_password(password):
        return jsonify({'message': 'Invalid email or password.'}), 401

    # If role was requested, verify match
    if requested_role and user.role != requested_role:
        return jsonify({'message': f'User is registered as a {user.role}, not a {requested_role}.'}), 401

    # Generate token
    token = AuthService.encode_auth_token(user.id, user.role)
    
    return jsonify({
        'message': 'Logged in successfully!',
        'token': token,
        'user': user.to_json()
    }), 200


@auth_bp.route('/me', methods=['GET'])
@token_required
def get_me():
    """Validates JWT bearer token and returns current user details"""
    return jsonify({
        'status': 'success',
        'user': g.current_user.to_json()
    }), 200


@auth_bp.route('/profile', methods=['GET'])
@token_required
def get_profile():
    return jsonify({'user': g.current_user.to_json()}), 200


@auth_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile():
    data = request.get_json() or {}
    user = g.current_user

    # Update basic profile details
    if 'name' in data or 'full_name' in data:
        user.name = (data.get('name') or data.get('full_name')).strip()
    if 'phone' in data:
        user.phone = data['phone'].strip()
    if 'address' in data:
        user.address = data['address'].strip()
        
    # Wallet simulation add funds
    if 'add_balance' in data:
        try:
            amt = float(data['add_balance'])
            if amt > 0:
                user.wallet_balance = (user.wallet_balance or 0.0) + amt
        except (ValueError, TypeError):
            return jsonify({'message': 'Invalid deposit value.'}), 400

    # Farmer profile updates
    if user.role == 'farmer':
        if 'farm_name' in data:
            user.farm_name = data['farm_name'].strip()
        if 'farm_location' in data or 'location' in data:
            user.farm_location = (data.get('farm_location') or data.get('location')).strip()
        if 'farm_story' in data:
            user.farm_story = data['farm_story'].strip()
        if 'avatar' in data:
            user.avatar = data['avatar'].strip()

    try:
        db.session.commit()
        return jsonify({
            'message': 'Profile details saved successfully!',
            'user': user.to_json()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error saving details.', 'error': str(e)}), 500

