import { Link } from "react-router-dom";
import CategoryPage from "@/components/bodyshop/CategoryPage";
import { ACCESSORIES } from "@/data/bodyshopProducts";

const FILTERS = ["All", "Scarves", "Belts", "Jewellery", "Eyewear"];

const hero = (
  <section
    className="flex flex-col items-center justify-center gap-4"
    style={{
      height: "220px",
      background: "linear-gradient(180deg, #E8A0A0 0%, #D4878F 50%, #C4747E 100%)",
    }}
  >
    <h1
      className="font-serif font-light text-white tracking-[0.2em] md:tracking-[0.5em]"
      style={{ fontSize: "clamp(22px, 6vw, 56px)" }}
    >
      ACCESSORIES
    </h1>
    <nav className="flex items-center gap-2 font-sans" style={{ fontSize: "12px" }}>
      <Link to="/the-body-shop" className="text-white/60 hover:text-white transition">
        Home
      </Link>
      <span className="text-white/40">&gt;</span>
      <span className="text-white">Accessories</span>
    </nav>
  </section>
);

export default function BodyShopAccessories() {
  return <CategoryPage hero={hero} filters={FILTERS} products={ACCESSORIES} />;
}
