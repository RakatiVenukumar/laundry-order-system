from flask import Blueprint, jsonify, request
from models.order import Order
from models.order_item import OrderItem

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/orders', methods=['GET'])
def get_orders():
    status = request.args.get('status')
    customer = request.args.get('customer')
    phone = request.args.get('phone')

    query = Order.query
    if status:
        query = query.filter_by(status=status)
    if customer:
        query = query.filter(Order.customer_name.ilike(f"%{customer}%"))
    if phone:
        query = query.filter(Order.phone.ilike(f"%{phone}%"))

    orders = query.all()
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
