import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/footer";
import Hero from "../../components/Hero";
import Categories from "../../components/Categories";
import ProductSection from "../../components/ProductSection";
import FlashSale from "../../components/FlashSale";
import Services from "../../components/Services";
import { productApi } from "../../services/api";
import "./home.css";

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [onSale, setOnSale] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productApi.getFeatured().catch(() => ({ products: [] })),
      productApi.getNewArrivals().catch(() => ({ products: [] })),
      productApi.getOnSale().catch(() => ({ products: [] })),
    ]).then(([featuredData, newData, saleData]) => {
      setFeatured(featuredData.products ?? featuredData ?? []);
      setNewArrivals(newData.products ?? newData ?? []);
      setOnSale(saleData.products ?? saleData ?? []);
      setLoading(false);
    });
  }, []);

  // Chuẩn hoá sản phẩm từ API sang shape ProductCard cần
  const normalize = (p) => ({
    id: p._id,
    name: p.name,
    price: p.price,
    originalPrice: p.discountPrice ? p.price : Math.round(p.price * 1.2),
    rating: p.avgRating ?? 4.5,
    reviewCount: p.reviewCount ?? 0,
    images: p.images?.length ? p.images : [{ url: p.imageUrl ?? "" }],
  });

  return (
    <>
      <Header />
      <main className="container">
        <Hero />
        <Categories />

        {loading ? (
          <p style={{ textAlign: "center", padding: "32px 0" }}>Đang tải sản phẩm...</p>
        ) : (
          <>
            {featured.length > 0 && (
              <ProductSection title="Sản phẩm nổi bật" products={featured.map(normalize)} />
            )}

            {newArrivals.length > 0 && (
              <ProductSection title="Sản phẩm mới" products={newArrivals.map(normalize)} />
            )}

            {onSale.length > 0 && (
              <>
                <FlashSale />
                <ProductSection products={onSale.map(normalize)} showHeader={false} />
              </>
            )}
          </>
        )}

        <Services />
      </main>
      <Footer />
    </>
  );
}
