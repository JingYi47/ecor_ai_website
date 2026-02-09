import { useParams } from "react-router-dom";
import { useState } from "react";
import { products } from "../../data/products";
import Header from "../../components/Header";
import Footer from "../../components/footer";
import ProductSection from "../../components/ProductSection";
import "./product_details.css";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [qty, setQty] = useState(1);

  if (!product) return <h2>Không tìm thấy sản phẩm</h2>;

  const increase = () => setQty(qty + 1);
  const decrease = () => qty > 1 && setQty(qty - 1);

  // 👉 LẤY SẢN PHẨM TƯƠNG TỰ (cùng category, khác id)
  const relatedProducts = products.filter(
    (item) => item.category === product.category && item.id !== product.id
  );

  return (
    <>
      <Header />

      {/* PRODUCT DETAIL */}
      <div className="product-detail container">
        {/* LEFT */}
        <div className="detail-left">
          <div className="thumbnail-list">
            {product.images.map((img, i) => (
              <img key={i} src={img.url} alt="" />
            ))}
          </div>

          <div className="main-image">
            <img src={product.images[0].url} alt={product.name} />
          </div>
        </div>

        {/* RIGHT */}
        <div className="detail-right">
          <h1>{product.name}</h1>

          <div className="rating">
            ⭐⭐⭐⭐⭐ <span>({product.reviewCount} đánh giá)</span>
            <span className="status"> | Còn hàng</span>
          </div>

          <div className="price">
            {product.price.toLocaleString()}đ
            <span>{product.originalPrice.toLocaleString()}đ</span>
          </div>

          <p className="desc">{product.description}</p>

          {/* COLORS */}
          <div className="colors">
            <p>Màu sắc:</p>
            <div className="color-list">
              {product.colors.map((c, i) => (
                <span key={i} style={{ background: c.code }} />
              ))}
            </div>
          </div>

          {/* PURCHASE ROW */}
          <div className="purchase-row">
            <div className="quantity">
              <button onClick={decrease}>−</button>
              <span>{qty}</span>
              <button onClick={increase}>+</button>
            </div>

            <div className="actions">
              <button className="buy">Mua ngay</button>
            </div>
          </div>

          {/* ADD PRODUCT BUTTON */}
          <button className="add-more">Thêm vào giỏ</button>

          {/* SERVICES */}
          <div className="services">
            <div className="service-item">
              🚚 <strong>Giao hàng miễn phí</strong>
              <p>Cho đơn hàng trên 500.000đ</p>
            </div>
            <div className="service-item">
              🔄 <strong>Đảm bảo hoàn tiền</strong>
              <p>Trong vòng 30 ngày</p>
            </div>
          </div>
        </div>
      </div>

      {/* SẢN PHẨM TƯƠNG TỰ (TÁI SỬ DỤNG COMPONENT HOME) */}
      <div className="container">
        <ProductSection title="Sản phẩm tương tự" products={relatedProducts} />
      </div>

      <Footer />
    </>
  );
}
