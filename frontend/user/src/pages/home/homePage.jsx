import Header from "../../components/Header";
import Footer from "../../components/footer";
import Hero from "../../components/Hero";
import Categories from "../../components/Categories";
import ProductSection from "../../components/ProductSection";
import FlashSale from "../../components/FlashSale";
import Services from "../../components/Services";
import { products } from "../../data/products";
import "./home.css";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="container">
        <Hero />
        <Categories />

        <ProductSection title="Sản phẩm bán chạy" products={products} />

        <ProductSection
          title="Khám phá sản phẩm của chúng tôi"
          products={products}
        />

        <FlashSale />

        <ProductSection products={products} showHeader={false} />

        <Services />
      </main>
      <Footer />
    </>
  );
}
