# Laundry Order Management System

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <your-repo-url>
   cd laundry-system
   ```
2. **Create and activate a virtual environment:**
   ```
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```
3. **Install dependencies:**
   ```
   pip install -r requirements.txt
   ```
4. **Initialize the database:**
   ```
   python init_db.py
   ```
5. **Run the Flask server:**
   ```
   python app.py
   ```

## Features Implemented
- Create laundry orders (customer, phone, garments, quantity, price)
- Track and update order status (RECEIVED, PROCESSING, READY, DELIVERED)
- Calculate billing (auto or custom price per item)
- List and filter orders (by status, customer, phone)
- Dashboard: total orders, revenue, orders per status
- Error handling for invalid input and missing data

## AI Usage Report

### Tools Used
- GitHub Copilot (VS Code)
- ChatGPT (OpenAI)

### Sample Prompts
- "Create a Flask project with SQLAlchemy and SQLite."
- "Build REST APIs for order creation, status update, filtering, and dashboard."
- "Fix circular import in Flask app."
- "Add error handling for missing fields and invalid status."

### What AI Got Wrong
- Sometimes generated code with circular imports (fixed by moving db to models/__init__.py)
- Missed registering blueprints in app.py (added manually)
- Generated duplicate or nested route definitions (cleaned up manually)

### What Was Improved
- Refactored code to use service layer for business logic
- Ensured all endpoints return clean JSON
- Added automatic table creation on app startup
- Improved error messages and validation

---

Feel free to add screenshots, API samples, or a demo video for submission!
