import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createOrder } from '../api/endpoints'
import { useCart } from '../context/CartContext'
import '../styles/checkout.css'

export default function Checkout() {
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { total, cartItems, fetchCart } = useCart()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!address || !city || !zipCode || !cardNumber) {
      setError('All fields are required')
      return
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty')
      return
    }

    try {
      setLoading(true)
      await createOrder()
      await fetchCart()
      alert('Order placed successfully!')
      navigate('/orders')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>

        <div className="checkout-layout">
          <div className="checkout-form">
            {error && <div className="error-box">{error}</div>}

            <form onSubmit={handleSubmit}>
              <fieldset>
                <legend>Shipping Address</legend>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Zip Code</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                  />
                </div>
              </fieldset>

              <fieldset>
                <legend>Payment Method (Mock)</legend>
                <p className="mock-payment">
                  This is a demonstration. No real payment processing occurs.
                </p>
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                    placeholder="1234 5678 9012 3456"
                    maxLength="16"
                    required
                  />
                </div>
              </fieldset>

              <button type="submit" disabled={loading} className="place-order-btn">
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          <aside className="checkout-summary">
            <h2>Order Summary</h2>
            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item.product_id} className="summary-item">
                  <span>{item.name}</span>
                  <span>${(item.quantity * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <strong>Total: ${total.toFixed(2)}</strong>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
