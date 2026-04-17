from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

db = SQLAlchemy(app)


# Register blueprints
from routes.example_route import example_bp
app.register_blueprint(example_bp)

if __name__ == "__main__":
    app.run(debug=True)
