from app.database import db
from app.models.category import Category
from app.models.user import User
from app.models.product import Product
from app.models.cart import Cart

def seed_db():
    """Seed database with normalized Categories, Users, Carts, and Reddy Farms Crops"""
    
    # 1. Clear existing database values
    db.session.query(Product).delete()
    db.session.query(Cart).delete()
    db.session.query(Category).delete()
    db.session.query(User).delete()
    db.session.commit()

    # 2. Seed Categories
    categories_data = [
        {'name': 'Spices & Turmeric', 'icon': 'Sprout', 'description': 'Hand-picked spices and turmeric roots from Jagtial'},
        {'name': 'Fruits', 'icon': 'Apple', 'description': 'Seasonal Banganapalle mangoes directly from trees'},
        {'name': 'Grains', 'icon': 'Wheat', 'description': 'Sustainable raw and unpolished native rice and grains'},
        {'name': 'Dals & Pulses', 'icon': 'Package', 'description': 'Rich plant-based proteins, unpolished lentils'}
    ]
    
    category_map = {}
    for cat_info in categories_data:
        cat = Category(name=cat_info['name'], icon=cat_info['icon'], description=cat_info['description'])
        db.session.add(cat)
        db.session.commit() # commit each to get their auto-generated IDs
        category_map[cat.name] = cat.id

    # 3. Add mock farmer (Thirupathi Reddy)
    farmer = User(
        name='Thirupathi Reddy',
        email='thirupathi@reddyfarms.com',
        role='farmer',
        phone='+91 94401 12233',
        farm_name='Reddy Organic Farms',
        farm_location='Bhupathipur, Jagtial, Telangana',
        farm_story='Cultivating turmeric, mangoes, and rice on our 25-acre family farm in Bhupathipur using traditional organic methods.',
        distance_km=38,
        avatar='https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150'
    )
    farmer.set_password('password123')
    db.session.add(farmer)

    # 4. Add mock farmer (Ramesh Anugu)
    farmer_ramesh = User(
        name='Ramesh Anugu',
        email='ramesh@anugufarms.com',
        role='farmer',
        phone='+91 98855 66778',
        farm_name='Anugu Organic Farms',
        farm_location='Chittoor, Andhra Pradesh',
        farm_story='Multi-generational organic orchard specialising in premium Banganapalle mangoes, coconut groves, and indigenous pulses.',
        distance_km=42,
        avatar='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
    )
    farmer_ramesh.set_password('password123')
    db.session.add(farmer_ramesh)

    # 5. Add mock customer (Rohan Sharma)
    customer = User(
        name='Rohan Sharma',
        email='rohan@gmail.com',
        role='customer',
        wallet_balance=1000.0,
        phone='+91 98765 43210',
        address='Apartment 4B, Green Glen Layout, Bellandur, Bengaluru - 560103'
    )
    customer.set_password('password123')
    db.session.add(customer)
    
    db.session.commit()

    # 6. Create Cart Headers for seeded users (1-to-1 relationship)
    db.session.add(Cart(user_id=farmer.id))
    db.session.add(Cart(user_id=farmer_ramesh.id))
    db.session.add(Cart(user_id=customer.id))
    db.session.commit()

    # 6. Seed Crops under Thirupathi Reddy's ID, linking Category ForeignKeys
    crops = [
        {
            'name': 'Pure Turmeric Powder (Haldi)',
            'category': 'Spices & Turmeric',
            'price': 195,
            'original_price': 250,
            'unit': '500g Resealable Pack',
            'image': 'https://images.unsplash.com/photo-1615485500704-8e3b96ef9726?auto=format&fit=crop&q=80&w=600',
            'organic': True,
            'bestseller': True,
            'tags': ['High Curcumin', 'Stone-Ground', 'Family Farm Special'],
            'harvest_date': 'March 2026',
            'shelf_life_days': 730,
            'stock': 85,
            'nutrients': {'curcumin': '3.5%', 'iron': '41mg per 100g', 'antioxidants': 'Very High'},
            'description': 'Stone-ground from our own turmeric roots grown in the red loam soils of Jagtial. Sun-dried then stone-milled — no synthetic colours or flow agents added.'
        },
        {
            'name': 'Whole Dried Turmeric Fingers',
            'category': 'Spices & Turmeric',
            'price': 145,
            'original_price': 190,
            'unit': '500g Pack',
            'image': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600',
            'organic': True,
            'bestseller': False,
            'tags': ['Whole Fingers', 'Sun-Dried', 'Raw & Natural'],
            'harvest_date': 'March 2026',
            'shelf_life_days': 1095,
            'stock': 40,
            'nutrients': {'curcumin': '3.2%', 'moisture': 'Less than 10%', 'purity': '100%'},
            'description': 'Whole dried turmeric fingers (rhizomes) harvested from our 25-acre farm in Bhupathipur. Naturally sun-dried for 15-20 days.'
        },
        {
            'name': 'Banganapalle Mangoes (Benishan)',
            'category': 'Fruits',
            'price': 280,
            'original_price': 350,
            'unit': '1 Dozen (approx 2.5 kg)',
            'image': 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&q=80&w=600',
            'organic': True,
            'bestseller': True,
            'tags': ['GI Tagged', 'No Ripening Agents', 'Anugu Orchard Special'],
            'harvest_date': 'May - June (Seasonal)',
            'shelf_life_days': 10,
            'stock': 30,
            'farmer_id': farmer_ramesh.id,
            'nutrients': {'calories': '60 kcal', 'vitaminC': '36mg', 'fiber': '1.6g'},
            'description': 'Naturally tree-ripened Banganapalle mangoes grown at Anugu Organic Farms in Chittoor, AP. Grown without calcium carbide.'
        },
        {
            'name': 'Fresh Tender Coconut Water Pack',
            'category': 'Fruits',
            'price': 120,
            'original_price': 150,
            'unit': 'Pack of 3 Coconuts',
            'image': 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&q=80&w=600',
            'organic': True,
            'bestseller': False,
            'tags': ['Hydrating', 'Anugu Orchard Special', 'Fresh Cut'],
            'harvest_date': 'Weekly Fresh',
            'shelf_life_days': 7,
            'stock': 40,
            'farmer_id': farmer_ramesh.id,
            'nutrients': {'electrolytes': 'High Potassium', 'calories': '19 kcal/100ml'},
            'description': 'Fresh tender coconuts harvested from Ramesh Anugu’s coastal groves in Chittoor.'
        },
        {
            'name': 'Sona Masuri Raw Rice (HMT)',
            'category': 'Grains',
            'price': 90,
            'original_price': 115,
            'unit': '1 kg',
            'image': 'https://images.unsplash.com/photo-1536304993881-ff86e0c9b8b0?auto=format&fit=crop&q=80&w=600',
            'organic': True,
            'bestseller': True,
            'tags': ['Telangana Native', 'Low GI', 'Farm Direct'],
            'harvest_date': 'December 2025',
            'shelf_life_days': 540,
            'stock': 120,
            'farmer_id': farmer.id,
            'nutrients': {'calories': '120 kcal cooked', 'carbs': '26g', 'protein': '2.5g'},
            'description': 'Freshly-milled Sona Masuri (HMT) rice, a premium medium-grain variety native to Telangana.'
        },
        {
            'name': 'Unpolished Brown Rice (Kaikuttu)',
            'category': 'Grains',
            'price': 115,
            'original_price': 145,
            'unit': '1 kg',
            'image': 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?auto=format&fit=crop&q=80&w=600',
            'organic': True,
            'bestseller': False,
            'tags': ['Unpolished', 'High Fiber', 'Diabetic Friendly'],
            'harvest_date': 'December 2025',
            'shelf_life_days': 365,
            'stock': 95,
            'farmer_id': farmer.id,
            'nutrients': {'fiber': '3.5g', 'magnesium': '84mg', 'protein': '2.6g'},
            'description': 'Hand-pounded unpolished brown rice with the bran layer intact.'
        },
        {
            'name': 'Organic Dried Corn Kernels',
            'category': 'Grains',
            'price': 80,
            'original_price': 100,
            'unit': '1 kg Pack',
            'image': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=600',
            'organic': True,
            'bestseller': False,
            'tags': ['Whole Grain', 'Fiber Rich', 'Non-GMO'],
            'harvest_date': 'January 2026',
            'shelf_life_days': 365,
            'stock': 60,
            'farmer_id': farmer.id,
            'nutrients': {'carbs': '74g', 'protein': '9g', 'fiber': '7g'},
            'description': 'Premium whole dried yellow corn kernels grown on sunny fields.'
        },
        {
            'name': 'Organic Toor Dal (Arhar Dal)',
            'category': 'Dals & Pulses',
            'price': 160,
            'original_price': 195,
            'unit': '1 kg Pack',
            'image': 'https://images.unsplash.com/photo-1547058886-f33f9a722885?auto=format&fit=crop&q=80&w=600',
            'organic': True,
            'bestseller': True,
            'tags': ['Protein Rich', 'Unpolished', 'Daily Staple'],
            'harvest_date': 'February 2026',
            'shelf_life_days': 365,
            'stock': 70,
            'farmer_id': farmer.id,
            'nutrients': {'protein': '22g', 'fiber': '15g', 'iron': '2.7mg'},
            'description': 'Premium unpolished Toor Dal sourced straight from Reddy Farms.'
        },
        {
            'name': 'Organic Split Moong Dal (Yellow)',
            'category': 'Dals & Pulses',
            'price': 150,
            'original_price': 180,
            'unit': '1 kg Pack',
            'image': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=600',
            'organic': True,
            'bestseller': False,
            'tags': ['Easy to Digest', 'Unpolished', 'Low Fat'],
            'harvest_date': 'February 2026',
            'shelf_life_days': 365,
            'stock': 50,
            'farmer_id': farmer.id,
            'nutrients': {'protein': '24g', 'fiber': '16g', 'folate': '60%'},
            'description': 'Split yellow Moong Dal grown with sustainable organic practices.'
        },
        {
            'name': 'Organic Chana Dal (Split Bengal Gram)',
            'category': 'Dals & Pulses',
            'price': 120,
            'original_price': 150,
            'unit': '1 kg Pack',
            'image': 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600',
            'organic': True,
            'bestseller': False,
            'tags': ['Low GI', 'Zinc Rich', 'Unpolished'],
            'harvest_date': 'January 2026',
            'shelf_life_days': 365,
            'stock': 45,
            'farmer_id': farmer.id,
            'nutrients': {'protein': '20g', 'fiber': '18g', 'iron': '4.3mg'},
            'description': 'Split Bengal Gram grown under rain-fed conditions.'
        },
        {
            'name': 'Organic Split Urad Dal (Black Gram)',
            'category': 'Dals & Pulses',
            'price': 140,
            'original_price': 170,
            'unit': '1 kg Pack',
            'image': 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=600',
            'organic': True,
            'bestseller': False,
            'tags': ['Iron Rich', 'Idli Batter Special', 'Unpolished'],
            'harvest_date': 'February 2026',
            'shelf_life_days': 365,
            'stock': 55,
            'farmer_id': farmer.id,
            'nutrients': {'protein': '25g', 'calcium': '154mg', 'iron': '6mg'},
            'description': 'Split black gram (with skin) cultivated organically.'
        },
        {
            'name': 'Organic Split Masoor Dal (Red)',
            'category': 'Dals & Pulses',
            'price': 130,
            'original_price': 160,
            'unit': '1 kg Pack',
            'image': 'https://images.unsplash.com/photo-1515942400420-2b98fed1f51b?auto=format&fit=crop&q=80&w=600',
            'organic': True,
            'bestseller': True,
            'tags': ['Quick Cook', 'Fibre Rich', 'Unpolished'],
            'harvest_date': 'March 2026',
            'shelf_life_days': 365,
            'stock': 80,
            'farmer_id': farmer.id,
            'nutrients': {'protein': '25g', 'fiber': '11g', 'potassium': '369mg'},
            'description': 'Split Red Lentils (Masoor Dal) from our Jagtial fields.'
        }
    ]

    for crop_data in crops:
        cat_id = category_map.get(crop_data['category'])
        if not cat_id:
            continue

        assigned_farmer_id = crop_data.get('farmer_id', farmer.id)

        product = Product(
            name=crop_data['name'],
            category_id=cat_id,
            price=crop_data['price'],
            original_price=crop_data['original_price'],
            unit=crop_data['unit'],
            image=crop_data['image'],
            organic=crop_data['organic'],
            bestseller=crop_data['bestseller'],
            tags=crop_data['tags'],
            harvest_date=crop_data['harvest_date'],
            shelf_life_days=crop_data['shelf_life_days'],
            stock=crop_data['stock'],
            description=crop_data['description'],
            nutrients=crop_data['nutrients'],
            farmer_id=assigned_farmer_id
        )
        db.session.add(product)

    db.session.commit()
    print("Normalized multi-vendor database seeding completed successfully!")
