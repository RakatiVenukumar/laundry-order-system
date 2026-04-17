
from flask import Blueprint, jsonify, request, abort
from models.order import Order
from models.order_item import OrderItem
from services.dashboard import get_dashboard_data
from services.order_service import create_order_service

orders_bp = Blueprint('orders', __name__)



@orders_bp.route('/orders', methods=['POST'])
def create_order():
    data = request.get_json()
    if not data or 'customer_name' not in data or 'phone' not in data or 'items' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    try:
        order_id, total = create_order_service(
            data['customer_name'],
            data['phone'],
            data['items']
        )
        return jsonify({'order_id': order_id, 'total_amount': total}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@orders_bp.route('/orders', methods=['GET'])
def get_orders():
    try:
        status = request.args.get('status')
        customer = request.args.get('customer')
        phone = request.args.get('phone')
        garment_type = request.args.get('garment_type')

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
            # Filter by garment_type if provided
            if garment_type:
                filtered_items = [i for i in items if garment_type.lower() in i['garment_type'].lower()]
                if not filtered_items:
                    continue
            else:
                filtered_items = items
            # Estimate delivery date: 3 days after created_at
            from datetime import timedelta
            estimated_delivery = order.created_at + timedelta(days=3)
            result.append({
                'id': order.id,
                'customer_name': order.customer_name,
                'phone': order.phone,
                'status': order.status,
                'total_amount': order.total_amount,
                'created_at': order.created_at,
                'estimated_delivery_date': estimated_delivery,
                'items': filtered_items
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
