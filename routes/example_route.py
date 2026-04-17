# Example route
from flask import Blueprint

example_bp = Blueprint('example', __name__)

@example_bp.route('/')
def home():
    return "Laundry System Home"
