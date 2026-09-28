import os
from werkzeug.utils import secure_filename
from flask import current_app

class FileHelper:
    @staticmethod
    def allowed_file(filename):
        """Check if file matches allowed extensions"""
        allowed = current_app.config.get('ALLOWED_EXTENSIONS', {'png', 'jpg', 'jpeg'})
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in allowed

    @classmethod
    def save_crop_image(cls, file):
        """Sanitize and save uploaded crop photo image"""
        if not file or not file.filename:
            return None, 'No file supplied or file name empty.'

        if not cls.allowed_file(file.filename):
            return None, 'File extension not allowed. Must be PNG, JPG, or JPEG.'

        # Create absolute directory paths
        upload_folder = current_app.config.get('UPLOAD_FOLDER')
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)

        # Sanitize and make unique filename to avoid overrides
        base_name = secure_filename(file.filename)
        filename = f"crop_{int(os.path.getmtime(upload_folder) if os.path.exists(upload_folder) else 1)}_{base_name}"
        
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)

        # Return static routing query path
        return f"/static/uploads/{filename}", None
