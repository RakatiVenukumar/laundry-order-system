from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config
from models import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)


    # Register blueprints
    from routes.orders import orders_bp
    app.register_blueprint(orders_bp)

    return app


app = create_app()

# Ensure tables are created at startup
with app.app_context():
    from models.order import Order
    from models.order_item import OrderItem
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
