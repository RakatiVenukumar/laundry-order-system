from app import app, db
from models.order import Order
from models.order_item import OrderItem

with app.app_context():
    db.create_all()
    print("Database tables created.")
