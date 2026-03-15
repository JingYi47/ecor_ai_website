import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./footer";
import ProductCard from "./ProductCard";
import FlashSale from "./FlashSale";
import { categoryApi } from "../services/api";

/**
 * Trang danh mục dùng chung cho iPhone, Laptop, iPad, Headphones, Mini Speaker...
 * @param {string} slug    - slug của danh mục trong DB (vd: "iphone", "laptop")
 * @param {string} title   - Tiêu đề hiển thị
 */
export default function CategoryPage({ slug, title }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    categoryApi.getProductsBySlug(slug)
      .then((data) => {
        const items = data.products ?? data ?? [];
        setProducts(
          items.map((p) => ({
            id: p._id,
            name: p.name,
            price: p.price,
            originalPrice: p.discountPrice ? p.price : Math.round(p.price * 1.2),
            rating: p.avgRating ?? 4.5,
            reviewCount: p.reviewCount ?? 0,
            images: p.images?.length ? p.images : [{ url: p.imageUrl ?? "" }],
          }))
        );
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <>
      <Header />

      <div className="container iphone-page">
        <div className="breadcrumb">
          <span>Trang chủ</span> / <strong>{title}</strong>
        </div>

        <h2 className="page-title">{title}</h2>

        {loading ? (
          <p style={{ textAlign: "center", padding: 32 }}>Đang tải...</p>
        ) : products.length === 0 ? (
          <p style={{ textAlign: "center", padding: 32 }}>Chưa có sản phẩm trong danh mục này</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <FlashSale />
      </div>

      <Footer />
    </>
  );
}
