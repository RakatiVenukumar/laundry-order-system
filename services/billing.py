# services/billing.py

# Hardcoded pricing per garment type
GARMENT_PRICING = {
    'Shirt': 50,
    'Pants': 60,
    'Saree': 100,
    'T-Shirt': 40,
    'Jacket': 120
}

def calculate_total(items):
    """
    items: list of dicts with keys 'garment_type', 'quantity', 'price_per_item' (optional)
    Returns total amount (float)
    """
    total = 0.0
    for item in items:
        price = item.get('price_per_item')
        if price is None:
            price = GARMENT_PRICING.get(item['garment_type'], 0)
        total += price * item['quantity']
    return total
