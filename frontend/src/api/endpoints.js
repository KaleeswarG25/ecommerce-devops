import API from './client'

// Auth APIs
export const registerUser = (name, email, password) =>
  API.post('/api/auth/register', { name, email, password })

export const loginUser = (email, password) =>
  API.post('/api/auth/login', { email, password })

export const getCurrentUser = () =>
  API.get('/api/auth/me')

// Products APIs
export const getProducts = (category, sortBy) => {
  let url = '/api/products'
  const params = new URLSearchParams()
  if (category) params.append('category', category)
  if (sortBy) params.append('sortBy', sortBy)
  return API.get(url + (params.toString() ? '?' + params.toString() : ''))
}

export const getProduct = (id) =>
  API.get(`/api/products/${id}`)

export const createProduct = (data) =>
  API.post('/api/products', data)

export const updateProduct = (id, data) =>
  API.put(`/api/products/${id}`, data)

export const deleteProduct = (id) =>
  API.delete(`/api/products/${id}`)

// Cart APIs
export const getCart = () =>
  API.get('/api/cart')

export const addToCart = (product_id, quantity) =>
  API.post('/api/cart', { product_id, quantity })

export const updateCartItem = (productId, quantity) =>
  API.put(`/api/cart/${productId}`, { quantity })

export const removeFromCart = (productId) =>
  API.delete(`/api/cart/${productId}`)

export const clearCart = () =>
  API.delete('/api/cart')

// Orders APIs
export const createOrder = () =>
  API.post('/api/orders')

export const getMyOrders = () =>
  API.get('/api/orders/my-orders')

export const getAllOrders = () =>
  API.get('/api/orders')

export const updateOrderStatus = (id, status) =>
  API.put(`/api/orders/${id}/status`, { status })

// Admin APIs
export const getStats = () =>
  API.get('/api/admin/stats')
