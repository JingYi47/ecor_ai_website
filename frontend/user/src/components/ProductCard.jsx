export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="img-box">
        <img src={product.image} alt={product.name} />
        <span className="heart">♡</span>
        <span className="cart">🛒</span>
      </div>

      <h3>{product.name}</h3>
      <p className="price">
        {product.price} <span>{product.oldPrice}</span>
      </p>

      <div className="rating">★★★★★ <small>(65)</small></div>
    </div>
  );
}
