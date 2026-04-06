import { useState } from "react";
import { Link } from "react-router-dom";

const FILTERS = ["ALL", "BRIDAL", "EVENING WEAR", "COUTURE"] as const;
type Filter = typeof FILTERS[number];

const BRANDS = [
  { name: "PRONOVIAS", origin: "Spain", category: "BRIDAL" },
  { name: "BERTA", origin: "Israel", category: "COUTURE" },
  { name: "GALIA LAHAV", origin: "Israel", category: "COUTURE" },
  { name: "MILLA NOVA", origin: "Ukraine", category: "BRIDAL" },
  { name: "ENZOANI", origin: "Holland", category: "BRIDAL" },
  { name: "NICOLE MILANO", origin: "Italy", category: "EVENING WEAR" },
] as const;

export default function CoutureBrands() {
  const [active, setActive] = useState<Filter>("ALL");

  const filtered = active === "ALL"
    ? BRANDS
    : BRANDS.filter((b) => b.category === active);

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden" style={{ height: "560px" }}>
        <img
          src="https://images.unsplash.com/photo-1747102232918-e1c4590f35f1?auto=format&fit=crop&w=1600&q=80"
          alt="Our Brands"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.06) 40%, rgba(0,0,0,0) 100%)" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <h1
            className="font-serif font-light text-white tracking-[0.75em]"
            style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
          >
            OUR BRANDS
          </h1>
          <div className="w-[60px] h-px bg-couture-gold" />
        </div>
      </section>

      {/* ── Intro ── */}
      <section className="flex flex-col items-center gap-3 pt-16 pb-10 px-6">
        <h2
          className="font-serif italic font-normal text-couture-gold-dark"
          style={{ fontSize: "32px" }}
        >
          World-Class Designers
        </h2>
        <p
          className="font-serif font-normal text-shared-grey-text text-center leading-relaxed"
          style={{ fontSize: "16px", maxWidth: "700px", lineHeight: 1.9 }}
        >
          Kootis Couture is proud to carry an extraordinary collection of world-renowned designer labels from Australia, Turkey, Europe, Holland, and Italy. Each brand has been carefully chosen for its commitment to exceptional craftsmanship, innovative design, and the ability to make every bride feel truly extraordinary.
        </p>
      </section>

      {/* ── Filter pills ── */}
      <div className="flex flex-wrap items-center justify-center gap-3 pb-12 px-6">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`rounded-full font-sans font-medium tracking-[0.18em] transition
              ${active === f
                ? "bg-couture-gold text-white"
                : "bg-transparent text-couture-gold border border-couture-gold hover:bg-couture-gold/10"
              }`}
            style={{ fontSize: "11px", padding: "10px 28px" }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── Brands grid ── */}
      <section className="px-[80px] pb-[60px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filtered.map((brand) => (
            <div
              key={brand.name}
              className="flex flex-col border border-shared-grey-light shadow-card hover:shadow-card-hover transition-shadow duration-300"
            >
              {/* Logo area */}
              <div className="flex items-center justify-center bg-white" style={{ height: "200px" }}>
                <span
                  className="font-serif font-semibold text-shared-grey-mid tracking-[0.4em] text-center px-4"
                  style={{ fontSize: "28px" }}
                >
                  {brand.name}
                </span>
              </div>

              {/* Info */}
              <div className="flex flex-col items-center gap-1.5 px-5 pt-4 pb-5">
                <span
                  className="font-serif font-semibold text-couture-charcoal tracking-[0.2em]"
                  style={{ fontSize: "16px" }}
                >
                  {brand.name}
                </span>
                <span className="font-sans text-shared-grey-text text-xs">{brand.origin}</span>
                <div className="w-10 h-px bg-couture-gold my-1" />
                <Link
                  to="/kootis-couture/book"
                  className="font-sans text-couture-gold tracking-[0.08em] hover:underline transition"
                  style={{ fontSize: "11px" }}
                >
                  View Collection
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="flex flex-col items-center gap-6 bg-couture-gold px-[80px] py-12">
        <p
          className="font-serif italic font-normal text-white text-center"
          style={{ fontSize: "clamp(18px, 2vw, 26px)" }}
        >
          Can't find your dream designer? Let us source it for you.
        </p>
        <Link
          to="/kootis-couture/book"
          className="inline-flex items-center justify-center text-white font-sans font-semibold tracking-[0.23em] border-[1.5px] border-white hover:bg-white hover:text-couture-gold transition"
          style={{ fontSize: "11px", padding: "12px 36px" }}
        >
          BOOK A CONSULTATION
        </Link>
      </section>
    </div>
  );
}
