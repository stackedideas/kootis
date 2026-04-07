import { Link } from "react-router-dom";
import { Truck } from "lucide-react";
import CategoryPage from "@/components/bodyshop/CategoryPage";
import { useProducts } from "@/hooks/useProducts";

const FILTERS = ["All New", "Shoes", "Handbags", "Watches", "Accessories"];

const HERO_IMG =
  "https://images.unsplash.com/photo-1633450750940-4eabe49f4722?auto=format&fit=crop&w=1080&q=80";

const hero = (
  <section className="flex flex-col md:flex-row" style={{ minHeight: "320px" }}>
    <div className="flex flex-col justify-center gap-5 bg-[#333333] px-8 py-10 md:px-10 md:py-0 md:w-1/2">
      <span
        className="font-serif font-light text-white tracking-[0.3em] md:tracking-[0.5em]"
        style={{ fontSize: "clamp(32px, 8vw, 56px)", lineHeight: 1 }}
      >
        NEW IN
      </span>
      <div className="w-[60px] h-[2px] bg-couture-gold" />
      <p className="font-sans text-white/80" style={{ fontSize: "15px" }}>
        Fresh styles, just landed.
      </p>
      <Link
        to="/the-body-shop/new"
        className="inline-flex items-center justify-center bg-bodyshop-blush text-white font-sans font-semibold tracking-[0.1em] hover:bg-bodyshop-blush-dark transition self-start"
        style={{ fontSize: "12px", padding: "12px 32px", borderRadius: "50px" }}
      >
        Shop Now
      </Link>
    </div>
    <div
      className="flex-1 overflow-hidden"
      style={{
        minHeight: "220px",
        backgroundImage: `url('${HERO_IMG}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  </section>
);

const promoBanner = (
  <div className="flex items-center justify-center gap-3 bg-bodyshop-blush text-white" style={{ height: "72px" }}>
    <Truck size={22} />
    <span className="font-sans font-medium tracking-[0.05em]" style={{ fontSize: "16px" }}>
      Free Delivery on Orders Over $500 TTD
    </span>
  </div>
);

const SHOE_CATS = ["Heels", "Flats", "Boots", "Sandals", "Sneakers"];
const BAG_CATS = ["Totes", "Clutches", "Crossbody", "Satchels"];
const WATCH_CATS = ["Luxury", "Sport", "Casual"];
const ACC_CATS = ["Scarves", "Belts", "Jewellery", "Eyewear"];

export default function BodyShopNewArrivals() {
  const { products, loading, error } = useProducts();

  function filterByTab(tab: string) {
    if (tab === "All New") return products;
    if (tab === "Shoes") return products.filter((p) => SHOE_CATS.includes(p.category));
    if (tab === "Handbags") return products.filter((p) => BAG_CATS.includes(p.category));
    if (tab === "Watches") return products.filter((p) => WATCH_CATS.includes(p.category));
    if (tab === "Accessories") return products.filter((p) => ACC_CATS.includes(p.category));
    return products;
  }

  return (
    <CategoryPage
      hero={hero}
      filters={FILTERS}
      products={products}
      filterFn={filterByTab}
      loading={loading}
      error={error}
      midBanner={promoBanner}
    />
  );
}
