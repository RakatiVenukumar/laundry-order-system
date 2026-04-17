
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Orders from './pages/Orders';
import Search from './pages/Search';
import Dashboard from './pages/Dashboard';


function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/orders">Orders</Link>
      <Link to="/search">Search</Link>
      <Link to="/dashboard">Dashboard</Link>
      {!token ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </>
      ) : (
        <button onClick={handleLogout} style={{marginLeft:16,background:'#6366f1',color:'#fff',border:'none',padding:'7px 18px',borderRadius:6,cursor:'pointer'}}>Logout</button>
      )}
    </nav>
  );
}

function App() {
  return (
    <Router>
      <NavBar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/search" element={<Search />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
