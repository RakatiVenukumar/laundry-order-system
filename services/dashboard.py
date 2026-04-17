from models.order import Order
from sqlalchemy import func

def get_dashboard_data():
    from app import db
    total_orders = db.session.query(func.count(Order.id)).scalar()
    total_revenue = db.session.query(func.coalesce(func.sum(Order.total_amount), 0)).scalar()
    status_counts = db.session.query(Order.status, func.count(Order.id)).group_by(Order.status).all()
    status_dict = {status: count for status, count in status_counts}
    return {
        'total_orders': total_orders,
        'total_revenue': total_revenue,
        'orders_per_status': status_dict
    }
