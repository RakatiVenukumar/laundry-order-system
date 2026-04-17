from models.order import Order
from models.order_item import OrderItem
from models import db
from services.billing import calculate_total

def create_order_service(customer_name, phone, items):
    total = calculate_total(items)
    order = Order(customer_name=customer_name, phone=phone, total_amount=total)
    db.session.add(order)
    db.session.flush()  # get order.id
    for item in items:
        order_item = OrderItem(
            order_id=order.id,
            garment_type=item['garment_type'],
            quantity=item['quantity'],
            price_per_item=item.get('price_per_item') or 0
        )
        db.session.add(order_item)
    db.session.commit()
    return order.id, total
