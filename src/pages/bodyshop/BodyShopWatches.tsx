import { Link } from "react-router-dom";
import CategoryPage from "@/components/bodyshop/CategoryPage";
import { useProducts } from "@/hooks/useProducts";

const FILTERS = ["All", "Luxury", "Sport", "Casual"];
const WATCH_CATS = ["Luxury", "Sport", "Casual"];

const hero = (
  <section
    className="flex flex-col items-center justify-center gap-4"
    style={{ height: "220px", background: "linear-gradient(180deg, #E8A0A0 0%, #D4878F 50%, #C4747E 100%)" }}
  >
    <h1 className="font-serif font-light text-white tracking-[0.3em] md:tracking-[0.75em]" style={{ fontSize: "clamp(28px, 8vw, 64px)" }}>
      WATCHES
    </h1>
    <nav className="flex items-center gap-2 font-sans" style={{ fontSize: "12px" }}>
      <Link to="/the-body-shop" className="text-white/60 hover:text-white transition">Home</Link>
      <span className="text-white/40">&gt;</span>
      <span className="text-white">Watches</span>
    </nav>
  </section>
);

export default function BodyShopWatches() {
  const { products, loading, error } = useProducts();
  const watches = products.filter((p) => WATCH_CATS.includes(p.category));
  return <CategoryPage hero={hero} filters={FILTERS} products={watches} loading={loading} error={error} />;
}
