import ProductCard from "./ProductCard";

export default function ProductSection({ title, products, showHeader = true }) {
  return (
    <section className="product-section">
      {showHeader && (
        <div className="section-header">
          <h2>{title}</h2>
          <button className="view-all">Xem tất cả</button>
        </div>
      )}

      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <button className="load-more">Xem tất cả sản phẩm</button>
    </section>
  );
}
