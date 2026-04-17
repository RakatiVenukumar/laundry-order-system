from flask import Blueprint, jsonify, request, abort
from models.order import Order
from models.order_item import OrderItem
from services.dashboard import get_dashboard_data

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/orders', methods=['GET'])
def get_orders():
    try:
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
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@orders_bp.route('/orders/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    allowed_statuses = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED']
    data = request.get_json()
    if not data or 'status' not in data:
        return jsonify({'error': 'Missing status field'}), 400
    new_status = data.get('status')
    if new_status not in allowed_statuses:
        return jsonify({'error': 'Invalid status'}), 400

    order = Order.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    order.status = new_status
    from app import db
    db.session.commit()
    return jsonify({'message': 'Status updated', 'order_id': order.id, 'new_status': order.status})

@orders_bp.route('/dashboard', methods=['GET'])
def dashboard():
    try:
        data = get_dashboard_data()
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
