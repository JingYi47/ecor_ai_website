import { products } from "../../data/products";
import Header from "../../components/Header";
import Footer from "../../components/footer";
import ProductCard from "../../components/ProductCard";
import FlashSale from "../../components/FlashSale";
import ProductSection from "../../components/ProductSection";

export default function headphones() {
  const headphonesProducts = products.filter((p) =>
    p.name.toLowerCase().includes("headphones")
  );

  return (
    <>
      <Header />

      <div className="container iphone-page">
        {/* BREADCRUMB */}
        <div className="breadcrumb">
          <span>Tài khoản</span> / <span>Sản phẩm</span> /
          <strong>headphones</strong>
        </div>

        {/* TITLE */}
        <h2 className="page-title">headphones</h2>

        {/* PRODUCT GRID */}
        <div className="product-grid">
          {headphonesProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <FlashSale />

        <ProductSection products={products} showHeader={false} />
      </div>

      <Footer />
    </>
  );
}
