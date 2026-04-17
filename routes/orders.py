from flask import Blueprint, jsonify
from models.order import Order
from models.order_item import OrderItem

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/orders', methods=['GET'])
def get_orders():
    orders = Order.query.all()
    result = []
    for order in orders:
        items = [
            {
                'id': item.id,
                'garment_type': item.garment_type,
                'quantity': item.quantity,
                'price_per_item': item.price_per_item
            }
            for item in order.items
        ]
        result.append({
            'id': order.id,
            'customer_name': order.customer_name,
            'phone': order.phone,
            'status': order.status,
            'total_amount': order.total_amount,
            'created_at': order.created_at,
            'items': items
        })
    return jsonify(result)
