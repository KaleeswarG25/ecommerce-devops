import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import '../styles/navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartItems } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const cartCount = cartItems.length

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🛒 DevSecOps E-Commerce
        </Link>

        <div className="navbar-search">
          <input type="text" placeholder="Search products..." className="search-input" />
          <button className="search-btn">🔍</button>
        </div>

        <div className="navbar-menu">
          <Link to="/products" className="nav-link">
            Shop
          </Link>

          {user ? (
            <>
              <Link to="/cart" className="nav-link cart-link">
                🛒 Cart ({cartCount})
              </Link>
              <Link to="/orders" className="nav-link">
                My Orders
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" className="nav-link admin-link">
                  Admin
                </Link>
              )}
              <div className="user-menu">
                <button className="user-btn">{user.name}</button>
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">
                    My Profile
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item logout">
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link register-link">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
