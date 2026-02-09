import { products } from "../../data/products";
import Header from "../../components/Header";
import Footer from "../../components/footer";
import ProductCard from "../../components/ProductCard";
import FlashSale from "../../components/FlashSale";
import ProductSection from "../../components/ProductSection";

export default function ipad() {
  const ipadProducts = products.filter((p) =>
    p.name.toLowerCase().includes("ipad")
  );

  return (
    <>
      <Header />

      <div className="container iphone-page">
        {/* BREADCRUMB */}
        <div className="breadcrumb">
          <span>Tài khoản</span> / <span>Sản phẩm</span> /<strong>ipad</strong>
        </div>

        {/* TITLE */}
        <h2 className="page-title">ipad</h2>

        {/* PRODUCT GRID */}
        <div className="product-grid">
          {ipadProducts.map((product) => (
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
