import { products } from "../../data/products";
import Header from "../../components/Header";
import Footer from "../../components/footer";
import ProductCard from "../../components/ProductCard";
import FlashSale from "../../components/FlashSale";
import ProductSection from "../../components/ProductSection";

export default function miniSpeaker() {
  const miniSpeakerProducts = products.filter((p) =>
    p.name.toLowerCase().includes("minispeaker")
  );

  return (
    <>
      <Header />

      <div className="container laptop-page">
        {/* BREADCRUMB */}
        <div className="breadcrumb">
          <span>Tài khoản</span> / <span>Sản phẩm</span> /
          <strong>mini Speaker</strong>
        </div>

        {/* TITLE */}
        <h2 className="page-title">mini Speaker</h2>

        {/* PRODUCT GRID */}
        <div className="product-grid">
          {miniSpeakerProducts.map((product) => (
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
