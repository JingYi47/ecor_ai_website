import Header from "../../components/Header";
import Footer from "../../components/footer";
import ProductCard from "../../components/ProductCard";
import { useState } from "react";
import "./FavoritePage.css";
import { MdDeleteOutline } from "react-icons/md";



export default function FavoritePage() {
  const [favorites] = useState([
    {
      id: 1,
      name: "Iphone 14",
      price: 11020000,
      originalPrice: 15020000,
      images: [{ url: "/img/ip14.png" }],
      rating: 4.5,
      reviewCount: 65,
    },
    {
      id: 2,
      name: "Tai nghe Airpod Pro 2",
      price: 4990000,
      originalPrice: 6530000,
      images: [{ url: "/img/airpod.png" }],
      rating: 4.5,
      reviewCount: 65,
    },
    {
      id: 3,
      name: "RGB liquid CPU Cooler",
      price: 2990000,
      originalPrice: 3449000,
      images: [{ url: "/img/rgb.png" }],
      rating: 4.5,
      reviewCount: 65,
    },
    {
      id: 4,
      name: "Macbook Air 13 M4 2025",
      price: 23990000,
      originalPrice: 25990000,
      images: [{ url: "/img/mac.png" }],
      rating: 4.5,
      reviewCount: 65,
    },
  ]);

  return (
    <>
      <Header />

      <div className="favorite-page">

        {/* TITLE */}
        <div className="favorite-header">
          <h2>Yêu thích ({favorites.length})</h2>
          <button className="view-all">Xem tất cả</button>
        </div>

        {/* FAVORITE LIST */}
        <div className="favorite-grid">
          {favorites.map((item) => (
            <div className="favorite-item" key={item.id}>
              <button className="delete-icon">
  <MdDeleteOutline />
</button>

              <ProductCard product={item} />
            </div>
          ))}
        </div>

        {/* RECOMMEND */}
        <div className="recommend-header">
          <h2>Dành cho bạn</h2>
          <button className="view-all">Xem tất cả</button>
        </div>

        <div className="favorite-grid">
          {favorites.map((item) => (
            <ProductCard key={"re" + item.id} product={item} />
          ))}
        </div>

      </div>

      <Footer />
    </>
  );
}
