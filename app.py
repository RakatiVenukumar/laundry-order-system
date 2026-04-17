from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from config import Config
from models import db


import os
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from models import db
from flask_sqlalchemy import SQLAlchemy

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    CORS(app)
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'super-secret-key')
    jwt = JWTManager(app)


    # Import User model
    from models.user import User

    with app.app_context():
        db.create_all()

    # Register blueprints
    from routes.orders import orders_bp
    app.register_blueprint(orders_bp)


    # Authentication routes (SQLite)
    @app.route('/api/signup', methods=['POST'])
    def signup():
        data = request.json
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        if User.query.filter_by(username=username).first():
            return jsonify({'msg': 'Username already exists'}), 400
        hashed_pw = generate_password_hash(password)
        user = User(username=username, password=hashed_pw, email=email)
        db.session.add(user)
        db.session.commit()
        return jsonify({'msg': 'Signup successful'}), 201

    @app.route('/api/login', methods=['POST'])
    def login():
        data = request.json
        username = data.get('username')
        password = data.get('password')
        user = User.query.filter_by(username=username).first()
        if not user or not check_password_hash(user.password, password):
            return jsonify({'msg': 'Invalid credentials'}), 401
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200


    # Example protected route (orders remain SQL-based)

    return app


app = create_app()

# Ensure tables are created at startup
with app.app_context():
    from models.order import Order
    from models.order_item import OrderItem
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
