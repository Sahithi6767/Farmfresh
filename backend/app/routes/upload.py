from flask import Blueprint, request, jsonify, g
from app.utils.file_helper import FileHelper
from app.services.auth_service import token_required, farmer_required

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/', methods=['POST'])
@token_required
@farmer_required
def upload_image():
    """Verify and save crop photo uploads for farmers"""
    if 'file' not in request.files:
        return jsonify({'message': 'No file element in the request.'}), 400

    file = request.files['file']
    
    if not file or file.filename == '':
        return jsonify({'message': 'No file selected for upload.'}), 400

    static_path, error = FileHelper.save_crop_image(file)
    if error:
        return jsonify({'message': error}), 400

    return jsonify({
        'message': 'Image uploaded successfully!',
        'image_url': static_path
    }), 200
