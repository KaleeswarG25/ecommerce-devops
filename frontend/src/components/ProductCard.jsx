import '../styles/productcard.css'

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <img src={product.image_url} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-description">{product.description.substring(0, 100)}...</p>
        <div className="product-footer">
          <div className="product-price-rating">
            <span className="product-price">${product.price.toFixed(2)}</span>
            <span className="product-rating">⭐ {product.rating}</span>
          </div>
          <button
            className="add-to-cart-btn"
            onClick={() => onAddToCart(product.id)}
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  )
}
