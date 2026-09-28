import re

class Validator:
    @staticmethod
    def validate_email(email):
        """Simple email regex check"""
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(email_regex, email))

    @classmethod
    def validate_registration(cls, data):
        """Validate registration request inputs"""
        errors = {}
        
        name = (data.get('name') or data.get('full_name') or '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        role = data.get('role', 'customer')

        if not name:
            errors['name'] = 'Full Name is required.'
        elif len(name) < 2:
            errors['name'] = 'Name must be at least 2 characters.'

        if not email:
            errors['email'] = 'Email is required.'
        elif not cls.validate_email(email):
            errors['email'] = 'Invalid email address format.'

        if not password:
            errors['password'] = 'Password is required.'
        elif len(password) < 6:
            errors['password'] = 'Password must be at least 6 characters.'

        if role not in ['customer', 'farmer']:
            errors['role'] = 'Role must be either customer or farmer.'

        # Farmer profile validations
        if role == 'farmer':
            farm_name = data.get('farm_name', '').strip()
            farm_location = (data.get('farm_location') or data.get('location') or '').strip()
            if not farm_name:
                errors['farm_name'] = 'Farm Name is required for farmers.'
            if not farm_location:
                errors['farm_location'] = 'Farm Location is required for farmers.'

        return errors

    @staticmethod
    def validate_product_input(data):
        """Validate crop product input details"""
        errors = {}
        
        name = data.get('name', '').strip()
        category = data.get('category', '').strip()
        price = data.get('price')
        unit = data.get('unit', '').strip()

        if not name:
            errors['name'] = 'Product Name is required.'
        
        allowed_categories = ['Spices & Turmeric', 'Fruits', 'Grains', 'Dals & Pulses']
        if not category:
            errors['category'] = 'Category is required.'
        elif category not in allowed_categories:
            errors['category'] = f'Category must be one of: {", ".join(allowed_categories)}'

        if price is None:
            errors['price'] = 'Price is required.'
        else:
            try:
                price_val = float(price)
                if price_val <= 0:
                    errors['price'] = 'Price must be greater than 0.'
            except (ValueError, TypeError):
                errors['price'] = 'Price must be a valid number.'

        if not unit:
            errors['unit'] = 'Unit details (e.g. 500g, 1 kg) are required.'

        return errors
