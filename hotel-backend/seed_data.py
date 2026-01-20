from app.database import SessionLocal
from app.models import User
from app.auth import get_password_hash

def seed_user():
    """Create initial admin user"""
    db = SessionLocal()
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.username == "admin").first()
    if existing_user:
        print("Admin user already exists!")
        db.close()
        return
    
    # Create admin user
    admin_user = User(
        username="admin",
        email="admin@hotel.com",
        hashed_password=get_password_hash("admin123")
    )
    
    db.add(admin_user)
    db.commit()
    print("✅ Admin user created successfully!")
    print("   Username: admin")
    print("   Password: admin123")
    db.close()

if __name__ == "__main__":
    seed_user()