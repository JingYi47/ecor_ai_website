import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  if (!product) return null;

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="img">
        <img src={product.images?.[0]?.url} alt={product.name} />
      </div>

      <h3>{product.name}</h3>

      <p className="price">
        {product.price.toLocaleString()}đ
        <span>{product.originalPrice.toLocaleString()}đ</span>
      </p>

      <div className="rating">
        ⭐ {product.rating} ({product.reviewCount})
      </div>
    </Link>
  );
}
