import { useState, useEffect } from "react";
import CategoryPage from "@/components/bodyshop/CategoryPage";
import { SALE_PRODUCTS } from "@/data/bodyshopProducts";

const FILTERS = ["All Sale", "Shoes", "Handbags", "Accessories", "Watches"];

// Sale ends 7 days from now (placeholder — replace with real end date)
const SALE_END = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div
      className="flex flex-col items-center border border-[#666666] rounded"
      style={{ padding: "12px 16px", minWidth: "60px" }}
    >
      <span className="font-sans font-bold text-white" style={{ fontSize: "24px" }}>
        {String(value).padStart(2, "0")}
      </span>
      <span className="font-sans text-white/50 tracking-[0.1em]" style={{ fontSize: "10px" }}>
        {label}
      </span>
    </div>
  );
}

function SaleHero() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    function tick() {
      const diff = SALE_END.getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="flex flex-col items-center justify-center gap-5 bg-[#333333] px-4 py-12 md:px-[60px]"
    >
      <div className="w-[120px] md:w-[200px] h-[1px] bg-couture-gold" />
      <h1
        className="font-serif font-bold text-white"
        style={{ fontSize: "clamp(48px, 14vw, 80px)", lineHeight: 1, letterSpacing: "clamp(0.3rem, 2vw, 1rem)" }}
      >
        SALE
      </h1>
      <p className="font-sans text-bodyshop-blush text-center" style={{ fontSize: "16px" }}>
        Up to 50% off selected styles.
      </p>
      <div className="w-[120px] md:w-[200px] h-[1px] bg-couture-gold" />

      {/* Countdown */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className="font-sans text-white/70 w-full text-center md:w-auto" style={{ fontSize: "13px" }}>
          Sale ends in:
        </span>
        <div className="flex items-center gap-2">
          <CountdownBox value={timeLeft.days} label="DAYS" />
          <CountdownBox value={timeLeft.hours} label="HRS" />
          <CountdownBox value={timeLeft.mins} label="MIN" />
          <CountdownBox value={timeLeft.secs} label="SEC" />
        </div>
      </div>

      <button
        className="inline-flex items-center justify-center bg-bodyshop-blush text-white font-sans font-semibold tracking-[0.1em] hover:bg-bodyshop-blush-dark transition"
        style={{ fontSize: "13px", padding: "12px 36px", borderRadius: "50px" }}
      >
        Shop All Sale
      </button>
    </section>
  );
}

const urgencyStrip = (
  <div
    className="flex items-center justify-center gap-3 bg-bodyshop-blush text-white"
    style={{ height: "64px" }}
  >
    <span style={{ fontSize: "18px" }}>⚡</span>
    <span className="font-sans font-semibold tracking-[0.05em]" style={{ fontSize: "16px" }}>
      Selling Fast — Limited Stock Remaining
    </span>
  </div>
);

export default function BodyShopSale() {
  return (
    <CategoryPage
      hero={<SaleHero />}
      filters={FILTERS}
      products={SALE_PRODUCTS}
      midBanner={urgencyStrip}
    />
  );
}
