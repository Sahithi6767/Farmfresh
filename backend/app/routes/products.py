from flask import Blueprint, request, jsonify, g
from app.database import db
from app.models.product import Product
from app.models.category import Category
from app.services.auth_service import token_required, farmer_required
from app.schemas.validation import Validator

products_bp = Blueprint('products', __name__)

@products_bp.route('/', methods=['GET'])
def get_products():
    """Retrieve catalog crops with multi-query filter bounds"""
    query = Product.query
    
    # Filter 1: Category Match (joined against Categories table)
    category = request.args.get('category')
    if category and category != 'all':
        query = query.join(Product.category_rel).filter(Category.name == category)

    # Filter 2: Search term query
    search = request.args.get('search')
    if search:
        search_term = f"%{search.strip().lower()}%"
        query = query.filter(
            Product.name.ilike(search_term) | 
            Product.description.ilike(search_term)
        )

    # Filter 3: Price Limit bounds
    max_price = request.args.get('max_price')
    if max_price:
        try:
            query = query.filter(Product.price <= float(max_price))
        except ValueError:
            pass

    # Filter 4: Organic certification toggle
    organic = request.args.get('organic')
    if organic == 'true':
        query = query.filter_by(organic=True)

    # Filter 5: Specific Farmer profile
    farmer_id = request.args.get('farmer_id')
    if farmer_id:
        try:
            query = query.filter_by(farmer_id=int(farmer_id))
        except ValueError:
            pass

    # Sort Parameters
    sort_by = request.args.get('sort_by', 'popular')
    if sort_by == 'low-to-high':
        query = query.order_by(Product.price.asc())
    elif sort_by == 'high-to-low':
        query = query.order_by(Product.price.desc())
    elif sort_by == 'rating':
        query = query.order_by(Product.rating.desc())
    else: # Popular / default
        query = query.order_by(Product.reviews_count.desc())

    # Slicing bounds
    try:
        limit = int(request.args.get('limit', 20))
        offset = int(request.args.get('offset', 0))
        products = query.limit(limit).offset(offset).all()
    except ValueError:
        products = query.all()

    return jsonify([prod.to_json() for prod in products]), 200


@products_bp.route('/farmer', methods=['GET'])
@token_required
@farmer_required
def get_farmer_products():
    """Retrieve listings strictly owned by the authenticated partner farmer"""
    products = Product.query.filter_by(farmer_id=g.current_user.id).order_by(Product.created_at.desc()).all()
    return jsonify([prod.to_json() for prod in products]), 200


@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Retrieve detailed crop information"""
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_json()), 200


@products_bp.route('/', methods=['POST'])
@token_required
@farmer_required
def add_product():
    """Empower partner farmers to publish new harvests"""
    data = request.get_json() or {}
    
    validation_errors = Validator.validate_product_input(data)
    if validation_errors:
        return jsonify({'errors': validation_errors}), 400

    try:
        # Resolve category
        category_name = data.get('category')
        category_obj = Category.query.filter_by(name=category_name).first()
        if not category_obj:
            category_obj = Category(name=category_name, icon='Leaf')
            db.session.add(category_obj)
            db.session.commit()

        # Create product
        new_prod = Product(
            name=data['name'].strip(),
            category_id=category_obj.id,
            price=float(data['price']),
            original_price=float(data['originalPrice']) if 'originalPrice' in data and data['originalPrice'] else None,
            unit=data.get('unit', '1 kg').strip(),
            image=data.get('image', 'https://images.unsplash.com/photo-1615485500704-8e3b96ef9726?auto=format&fit=crop&q=80&w=600'),
            organic=data.get('organic', True),
            bestseller=data.get('bestseller', False),
            stock=int(data.get('stock', 50)),
            description=data.get('description', '').strip(),
            
            tags=data.get('tags', ['Fresh harvest', 'Direct Trade']),
            nutrients=data.get('nutrients', {'Calories': 'Approx 40 kcal/100g'}),
            harvest_date=data.get('harvestDate', 'Harvested fresh this week'),
            shelf_life_days=int(data.get('shelfLifeDays', 30)),
            
            farmer_id=g.current_user.id
        )

        db.session.add(new_prod)
        db.session.commit()
        
        return jsonify({
            'message': 'Harvest produce listed successfully!',
            'product': new_prod.to_json()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error listing harvest crop.', 'error': str(e)}), 500


@products_bp.route('/<int:product_id>', methods=['PUT'])
@token_required
@farmer_required
def edit_product(product_id):
    """Allow owners to modify crop stock, pricing or details"""
    product = Product.query.get_or_404(product_id)
    
    # Enforce ownership: only listing farmer can edit
    if product.farmer_id != g.current_user.id:
        return jsonify({'message': 'Access denied. You do not own this harvest listing!'}), 403

    data = request.get_json() or {}

    try:
        if 'name' in data:
            product.name = data['name'].strip()
        if 'category' in data:
            category_name = data['category']
            category_obj = Category.query.filter_by(name=category_name).first()
            if not category_obj:
                category_obj = Category(name=category_name, icon='Leaf')
                db.session.add(category_obj)
                db.session.commit()
            product.category_id = category_obj.id
        if 'price' in data:
            product.price = float(data['price'])
        if 'originalPrice' in data:
            product.original_price = float(data['originalPrice']) if data['originalPrice'] else None
        if 'unit' in data:
            product.unit = data['unit'].strip()
        if 'image' in data:
            product.image = data['image'].strip()
        if 'stock' in data:
            product.stock = int(data['stock'])
        if 'description' in data:
            product.description = data['description'].strip()
        if 'organic' in data:
            product.organic = bool(data['organic'])
        if 'bestseller' in data:
            product.bestseller = bool(data['bestseller'])
            
        db.session.commit()
        
        return jsonify({
            'message': 'Harvest details updated successfully!',
            'product': product.to_json()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error updating details.', 'error': str(e)}), 500


@products_bp.route('/<int:product_id>', methods=['DELETE'])
@token_required
@farmer_required
def remove_product(product_id):
    """Remove crop listing from catalog"""
    product = Product.query.get_or_404(product_id)
    
    # Enforce ownership
    if product.farmer_id != g.current_user.id:
        return jsonify({'message': 'Access denied. You do not own this harvest listing!'}), 403

    try:
        db.session.delete(product)
        db.session.commit()
        return jsonify({'message': 'Product listing removed from database catalog.'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error deleting product listing.', 'error': str(e)}), 500
