import { useNavigate } from 'react-router-dom'
import { removeFromCart, updateCartItem, clearCart } from '../api/endpoints'
import { useCart } from '../context/CartContext'
import '../styles/cart.css'

export default function Cart() {
  const { cartItems, subtotal, tax, total, fetchCart } = useCart()
  const navigate = useNavigate()

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return
    try {
      await updateCartItem(productId, newQuantity)
      await fetchCart()
    } catch (err) {
      alert('Failed to update cart')
    }
  }

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart(productId)
      await fetchCart()
    } catch (err) {
      alert('Failed to remove item')
    }
  }

  const handleClearCart = async () => {
    if (window.confirm('Clear entire cart?')) {
      try {
        await clearCart()
        await fetchCart()
      } catch (err) {
        alert('Failed to clear cart')
      }
    }
  }

  const handleCheckout = () => {
    navigate('/checkout')
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="container">
          <h1>Your Cart is Empty</h1>
          <p>Browse our products and add items to your cart</p>
          <button onClick={() => navigate('/products')} className="continue-shopping">
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>

        <div className="cart-layout">
          <div className="cart-items">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.product_id}>
                    <td className="product-cell">
                      <img src={item.image_url || 'https://via.placeholder.com/50'} alt={item.name} />
                      <span>{item.name}</span>
                    </td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.product_id, parseInt(e.target.value))
                        }
                        className="quantity-input"
                      />
                    </td>
                    <td>${(item.quantity * item.price).toFixed(2)}</td>
                    <td>
                      <button
                        onClick={() => handleRemoveItem(item.product_id)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={handleClearCart} className="clear-cart-btn">
              Clear Cart
            </button>
          </div>

          <aside className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-item">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Tax (10%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-item total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout} className="checkout-btn">
              Proceed to Checkout
            </button>
            <button onClick={() => navigate('/products')} className="continue-shopping-btn">
              Continue Shopping
            </button>
          </aside>
        </div>
      </div>
    </div>
  )
}
