import { products } from "../../data/products";
import Header from "../../components/Header";
import Footer from "../../components/footer";
import ProductCard from "../../components/ProductCard";
import FlashSale from "../../components/FlashSale";
import ProductSection from "../../components/ProductSection";

export default function Laptop() {
  const LaptopProducts = products.filter((p) =>
    p.name.toLowerCase().includes("laptop")
  );

  return (
    <>
      <Header />

      <div className="container laptop-page">
        {/* BREADCRUMB */}
        <div className="breadcrumb">
          <span>Tài khoản</span> / <span>Sản phẩm</span> /
          <strong>Laptop</strong>
        </div>

        {/* TITLE */}
        <h2 className="page-title">Laptop</h2>

        {/* PRODUCT GRID */}
        <div className="product-grid">
          {LaptopProducts.map((product) => (
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
