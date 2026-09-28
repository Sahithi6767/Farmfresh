from functools import wraps
from datetime import datetime, timedelta
import jwt
from flask import request, jsonify, g, current_app
from app.models.user import User

class AuthService:
    @staticmethod
    def encode_auth_token(user_id, role):
        """
        Generates the Auth Token
        :return: string
        """
        try:
            payload = {
                'exp': datetime.utcnow() + timedelta(days=7),
                'iat': datetime.utcnow(),
                'sub': user_id,
                'role': role
            }
            return jwt.encode(
                payload,
                current_app.config.get('JWT_SECRET_KEY'),
                algorithm='HS256'
            )
        except Exception as e:
            return e

    @staticmethod
    def decode_auth_token(auth_token):
        """
        Decodes the auth token
        :param auth_token:
        :return: integer|string
        """
        try:
            payload = jwt.decode(
                auth_token,
                current_app.config.get('JWT_SECRET_KEY'),
                algorithms=['HS256']
            )
            return payload
        except jwt.ExpiredSignatureError:
            return 'Signature expired. Please log in again.'
        except jwt.InvalidTokenError:
            return 'Invalid token. Please log in again.'

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Parse Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1] # format Bearer <token>
            except IndexError:
                return jsonify({'message': 'Bearer token missing in Authorization header'}), 401
                
        if not token:
            return jsonify({'message': 'Authentication Token is missing!'}), 401
            
        decoded_payload = AuthService.decode_auth_token(token)
        
        if isinstance(decoded_payload, str):
            return jsonify({'message': decoded_payload}), 401
            
        current_user = User.query.get(decoded_payload['sub'])
        if not current_user:
            return jsonify({'message': 'Logged in user not found!'}), 401
            
        g.current_user = current_user
        g.user_role = decoded_payload.get('role', 'customer')
        
        return f(*args, **kwargs)
        
    return decorated

def farmer_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not hasattr(g, 'current_user') or g.current_user.role != 'farmer':
            return jsonify({'message': 'Farmer authorization level required!'}), 403
        return f(*args, **kwargs)
    return decorated
