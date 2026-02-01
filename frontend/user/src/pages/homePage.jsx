import Header from "../components/Header";
import Footer from "../components/footer";
import iphone from "../assets/iphone1.jpg";
import iphone1 from "../assets/iphone.png";
import speaker from "../assets/speaker.png";
import ipad from "../assets/ipad.png";
import headphones from "../assets/headphones.png";
import laptop from "../assets/laptop.png"
import "../styles/home.css";

const products = [
  {
    id: 1,
    name: "Iphone 14",
    price: "11.020.000đ",
    oldPrice: "15.020.000đ",
    image: iphone,
  },
];

export default function homePage() {
  return (
    <>
      <Header />

      <main className="container">

        {/* HERO */}
        <section className="hero">
          <div className="hero-left">
            <p className="sub"> Bộ sưu tập iPhone </p>
            <h1>Ưu đãi đặc biệt lên tới 20%</h1>
            <button className="buy">Mua ngay →</button>
          </div>

          <div className="hero-right">
            <img src={iphone} alt="iphone" />
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="categories">
          <h2>Danh mục phổ biến</h2>

          <div className="category-list">
  <div className="category">
    <img src={iphone1} alt="Iphone" />
  </div>

  <div className="category">
    <img src={speaker} alt="Mini Speakers" />
  </div>

  <div className="category">
    <img src={ipad} alt="Ipad" />
  </div>

  <div className="category">
    <img src={headphones} alt="Headphones" />
  </div>

  <div className="category">
    <img src={laptop} alt="Laptop" />
  </div>
</div>

        </section>
        {/* FEATURED PRODUCTS */}
        <section className="product-section">
        <div className="section-header">
          <h2>Sản phẩm bán chạy</h2>
          <button className="view-all">Xem tất cả</button>
        </div>

        <div className="product-grid">
          {products.map((p) => (
            <div className="product-card" key={p.id}>
              <div className="img-box">
                <img src={p.image} alt={p.name} />
                <span className="heart">♡</span>
                <span className="cart">🛒</span>
              </div>

              <h3>{p.name}</h3>
              <p className="price">
                {p.price} <span>{p.oldPrice}</span>
              </p>

              <div className="rating">★★★★★ <small>(65)</small></div>
            </div>
          ))}
        </div>

        <button className="load-more">Xem tất cả sản phẩm</button>
      </section>

      {/* MY PRODUCT */}
    <section className="product-section">
        <div className="section-header">
          <h2>Khám phá sản phẩm của chúng tôi</h2>
          <button className="view-all">Xem tất cả</button>
        </div>

        <div className="product-grid">
          {products.map((p) => (
            <div className="product-card" key={p.id}>
              <div className="img-box">
                <img src={p.image} alt={p.name} />
                <span className="heart">♡</span>
                <span className="cart">🛒</span>
              </div>

              <h3>{p.name}</h3>
              <p className="price">
                {p.price} <span>{p.oldPrice}</span>
              </p>

              <div className="rating">★★★★★ <small>(65)</small></div>
            </div>
          ))}
        </div>

        <button className="load-more">Xem tất cả sản phẩm</button>
    </section>

    <section className="flash-sale">
  <div className="flash-left">
    <span className="today">Today's</span>
    <h2>Flash Sales</h2>
  </div>

  <div className="flash-timer">
    <div className="time-box">
      <p>Days</p>
      <h3>03</h3>
    </div>
    <span>:</span>

    <div className="time-box">
      <p>Hours</p>
      <h3>23</h3>
    </div>
    <span>:</span>

    <div className="time-box">
      <p>Minutes</p>
      <h3>19</h3>
    </div>
    <span>:</span>

    <div className="time-box">
      <p>Seconds</p>
      <h3>56</h3>
    </div>
  </div>

  <div className="flash-nav">
    <button>{"<"}</button>
    <button>{">"}</button>
  </div>
</section>

    <section className="product-section">
        <div className="section-header">

          <button className="view-all">Xem tất cả</button>
        </div>

        <div className="product-grid">
          {products.map((p) => (
            <div className="product-card" key={p.id}>
              <div className="img-box">
                <img src={p.image} alt={p.name} />
                <span className="heart">♡</span>
                <span className="cart">🛒</span>
              </div>

              <h3>{p.name}</h3>
              <p className="price">
                {p.price} <span>{p.oldPrice}</span>
              </p>

              <div className="rating">★★★★★ <small>(65)</small></div>
            </div>
          ))}
        </div>

        <button className="load-more">Xem tất cả sản phẩm</button>
    </section>

    {/* SERVICES */}
<section className="services">
  <div className="service-item">
    <div className="service-icon">
      🚚
    </div>
    <h4>Giao hàng miễn phí</h4>
    <p>Giao hàng miễn phí cho mọi đơn hàng trên 500.000đ</p>
  </div>

  <div className="service-item">
    <div className="service-icon">
      🎧
    </div>
    <h4>Hỗ trợ khách hàng 24/7</h4>
    <p>Hỗ trợ khách hàng thân thiện 24 giờ, 7 ngày</p>
  </div>

  <div className="service-item">
    <div className="service-icon">
      ✔
    </div>
    <h4>Đảm bảo hoàn tiền</h4>
    <p>Chúng tôi hoàn tiền trong vòng 30 ngày</p>
  </div>
</section>

      </main>
      <Footer />
    </>
  );
}
