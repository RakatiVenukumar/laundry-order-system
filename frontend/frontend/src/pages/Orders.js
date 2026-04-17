import { useEffect, useState } from 'react';

const STATUS_OPTIONS = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];

function StatusBadge({ status }) {
  const colors = {
    RECEIVED: '#e0e7ff',
    PROCESSING: '#fef9c3',
    READY: '#bbf7d0',
    DELIVERED: '#f0fdf4',
  };
  const textColors = {
    RECEIVED: '#3730a3',
    PROCESSING: '#b45309',
    READY: '#15803d',
    DELIVERED: '#166534',
  };
  return <span style={{background: colors[status], color: textColors[status], padding:'2px 10px', borderRadius:8, fontWeight:600, fontSize:'0.95em', marginLeft:8}}>{status}</span>;
}

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.18)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#fff',padding:32,borderRadius:12,minWidth:340,boxShadow:'0 8px 32px rgba(0,0,0,0.12)'}}>
        {children}
        <button onClick={onClose} style={{marginTop:16}}>Close</button>
      </div>
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [newOrder, setNewOrder] = useState({ customer_name: '', phone: '', items: [{ garment_type: '', quantity: 1, price_per_item: 0 }] });
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');

  // Logout functionality
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      let url = 'http://localhost:5000/orders';
      if (filter) url += `?status=${filter}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setOrders(data);
      else setError(data.error || 'Failed to fetch orders');
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); /* eslint-disable-next-line */ }, [filter]);

  // Create order
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:5000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newOrder)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Order created!');
        setShowCreate(false);
        setNewOrder({ customer_name: '', phone: '', items: [{ garment_type: '', quantity: 1, price_per_item: 0 }] });
        fetchOrders();
      } else setError(data.error || 'Failed to create order');
    } catch (err) {
      setError('Network error');
    }
  };

  // Delete order
  const handleDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };
  const confirmDelete = async () => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`http://localhost:5000/orders/${deleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Order deleted');
        fetchOrders();
      } else setError(data.error || 'Failed to delete order');
    } catch (err) {
      setError('Network error');
    }
    setShowConfirm(false);
    setDeleteId(null);
  };

  // Update status
  const handleStatusUpdate = async (id, status) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`http://localhost:5000/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Status updated');
        fetchOrders();
      } else setError(data.error || 'Failed to update status');
    } catch (err) {
      setError('Network error');
    }
  };

  // Add/remove items in create order form
  const addItem = () => setNewOrder({ ...newOrder, items: [...newOrder.items, { garment_type: '', quantity: 1, price_per_item: 0 }] });
  const removeItem = (idx) => setNewOrder({ ...newOrder, items: newOrder.items.filter((_, i) => i !== idx) });

  if (!token) {
    return <div className="card"><h2>Unauthorized</h2><p>Please <a href="/login">login</a> to view orders.</p></div>;
  }

  return (
    <div className="card" style={{maxWidth:1100}}>
      <h2 style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        Orders
        <button onClick={handleLogout} style={{marginLeft:16}}>Logout</button>
      </h2>
      <div style={{marginBottom:16,display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
        <button onClick={() => setShowCreate(v => !v)}>{showCreate ? 'Cancel' : 'Create Order'}</button>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <Modal open={showCreate} onClose={() => setShowCreate(false)}>
        <h3>Create Order</h3>
        <form onSubmit={handleCreateOrder} style={{marginBottom:12}}>
          <input type="text" placeholder="Customer Name" value={newOrder.customer_name} onChange={e => setNewOrder(o => ({...o, customer_name: e.target.value}))} required style={{marginBottom:8}} />
          <input type="text" placeholder="Phone" value={newOrder.phone} onChange={e => setNewOrder(o => ({...o, phone: e.target.value}))} required style={{marginBottom:8}} />
          <b>Items:</b>
          {newOrder.items.map((item, idx) => (
            <div key={idx} style={{marginBottom:8,display:'flex',gap:8,alignItems:'center'}}>
              <input type="text" placeholder="Garment Type" value={item.garment_type} onChange={e => setNewOrder(o => { const items = [...o.items]; items[idx].garment_type = e.target.value; return {...o, items}; })} required style={{width:120}} />
              <input type="number" placeholder="Quantity" value={item.quantity} min={1} onChange={e => setNewOrder(o => { const items = [...o.items]; items[idx].quantity = Number(e.target.value); return {...o, items}; })} required style={{width:70}} />
              <input type="number" placeholder="Price" value={item.price_per_item} min={0} onChange={e => setNewOrder(o => { const items = [...o.items]; items[idx].price_per_item = Number(e.target.value); return {...o, items}; })} required style={{width:90}} />
              <button type="button" onClick={() => removeItem(idx)} disabled={newOrder.items.length === 1}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={addItem}>Add Item</button>
          <button type="submit">Submit Order</button>
        </form>
      </Modal>
      <Modal open={showConfirm} onClose={() => setShowConfirm(false)}>
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete this order?</p>
        <button onClick={confirmDelete} style={{background:'#ef4444',color:'#fff'}}>Yes, Delete</button>
      </Modal>
      {error && <div style={{color:'red',marginBottom:12}}>{error}</div>}
      {success && <div style={{color:'green',marginBottom:12}}>{success}</div>}
      {loading ? <div>Loading...</div> : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))',gap:24}}>
          {orders.length === 0 && <div className="card">No orders found.</div>}
          {orders.map(order => (
            <div key={order.id} className="card" style={{boxShadow:'0 2px 8px rgba(0,0,0,0.07)',borderLeft:'6px solid #6366f1',margin:0}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div>
                  <b>Order #{order.id}</b> <StatusBadge status={order.status} />
                </div>
                <button onClick={() => handleDelete(order.id)} style={{background:'#ef4444',color:'#fff'}}>Delete</button>
              </div>
              <div style={{margin:'8px 0'}}>
                <b>{order.customer_name}</b> ({order.phone})
              </div>
              <div style={{marginBottom:8}}>
                Status: <select value={order.status} onChange={e => handleStatusUpdate(order.id, e.target.value)}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div><b>Items:</b>
                <ul style={{margin:'6px 0 0 18px'}}>
                  {order.items.map(item => (
                    <li key={item.id || Math.random()}>{item.garment_type} x{item.quantity} @ ₹{item.price_per_item}</li>
                  ))}
                </ul>
              </div>
              <div style={{marginTop:8}}>
                <b>Total:</b> ₹{order.total_amount} <br/>
                <b>Created:</b> {new Date(order.created_at).toLocaleString()}<br/>
                <b>Est. Delivery:</b> {order.estimated_delivery_date ? new Date(order.estimated_delivery_date).toLocaleDateString() : ''}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}