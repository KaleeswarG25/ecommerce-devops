import React, { createContext, useState, useEffect } from 'react'
import { getCart } from '../api/endpoints'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [subtotal, setSubtotal] = useState(0)
  const [tax, setTax] = useState(0)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchCart = async () => {
    try {
      setLoading(true)
      const response = await getCart()
      setCartItems(response.data.items || [])
      setSubtotal(response.data.subtotal || 0)
      setTax(response.data.tax || 0)
      setTotal(response.data.total || 0)
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchCart()
    }
  }, [])

  const updateCart = (items) => {
    setCartItems(items)
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0)
    const tax = subtotal * 0.1
    const total = subtotal + tax
    setSubtotal(subtotal)
    setTax(tax)
    setTotal(total)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        subtotal,
        tax,
        total,
        loading,
        fetchCart,
        updateCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = React.useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
