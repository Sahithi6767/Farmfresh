from app import create_app
from app.database import db
from app.database.seed import seed_db
from app.models.user import User

# Instantiate application factory
app = create_app()

with app.app_context():
    # Build database schema tables automatically on startup
    db.create_all()
    
    # Auto-seed the database with Reddy Farms items if empty
    if User.query.first() is None:
        try:
            seed_db()
        except Exception as e:
            print(f"Warning: Failed to seed database: {e}")

if __name__ == '__main__':
    # Host on port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)
