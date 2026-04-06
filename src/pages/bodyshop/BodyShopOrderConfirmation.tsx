import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import ProductCard from "@/components/bodyshop/ProductCard";
import { ALL_PRODUCTS } from "@/data/bodyshopProducts";

// Generate a random order number (in production this comes from the DB)
const ORDER_NUM = `TBS-2026-${String(Math.floor(10000 + Math.random() * 90000)).padStart(5, "0")}`;

const RELATED = ALL_PRODUCTS.filter((p) => p.badge === "NEW").slice(0, 4);

export default function BodyShopOrderConfirmation() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Minimal header */}
      <div className="flex items-center justify-center border-b border-[#E0D5D5] bg-white" style={{ padding: "20px 0" }}>
        <Link to="/the-body-shop" className="flex flex-col items-center gap-0.5">
          <span className="font-serif italic text-bodyshop-charcoal" style={{ fontSize: "28px" }}>
            The Body Shop
          </span>
          <span className="font-sans tracking-[0.2em] text-bodyshop-charcoal" style={{ fontSize: "12px" }}>
            by Kootis
          </span>
        </Link>
      </div>

      {/* Hero: thank you */}
      <div
        className="flex flex-col items-center gap-5 bg-[#FDF6F6]"
        style={{ padding: "60px 20px" }}
      >
        <CheckCircle size={80} className="text-bodyshop-blush" strokeWidth={1.5} />
        <h1
          className="font-serif italic text-bodyshop-charcoal text-center"
          style={{ fontSize: "36px" }}
        >
          Thank You for Your Order!
        </h1>
        <p className="font-sans text-[#666] text-center" style={{ fontSize: "14px" }}>
          A confirmation email has been sent to your inbox.
        </p>
        <p className="font-sans font-bold text-bodyshop-charcoal" style={{ fontSize: "16px" }}>
          Order #{ORDER_NUM}
        </p>
        <p className="font-sans text-[#666]" style={{ fontSize: "14px" }}>
          Estimated Delivery: {new Date(Date.now() + 7 * 86400000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      {/* Order card */}
      <div className="flex justify-center" style={{ padding: "40px 20px" }}>
        <div
          className="w-full flex flex-col gap-5 bg-white rounded-lg"
          style={{ maxWidth: "700px", padding: "32px", border: "1px solid rgba(201,169,110,0.3)" }}
        >
          <h2 className="font-sans font-bold text-bodyshop-charcoal tracking-[0.2em]" style={{ fontSize: "13px" }}>
            ORDER DETAILS
          </h2>
          <div className="h-px bg-[#E0D5D5]" />
          <div className="flex flex-col gap-4">
            {RELATED.slice(0, 2).map((p) => (
              <div key={p.id} className="flex items-center gap-4">
                <div className="w-16 h-16 overflow-hidden rounded shrink-0 bg-[#F8F8F8]">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col gap-0.5 flex-1">
                  <span className="font-sans font-medium text-bodyshop-charcoal" style={{ fontSize: "13px" }}>{p.name}</span>
                  <span className="font-sans text-[#999]" style={{ fontSize: "11px" }}>Qty: 1</span>
                </div>
                <span className="font-sans font-semibold text-bodyshop-charcoal" style={{ fontSize: "13px" }}>
                  ${p.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="h-px bg-[#E0D5D5]" />
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="font-sans text-[#666]" style={{ fontSize: "13px" }}>Subtotal</span>
              <span className="font-sans font-medium" style={{ fontSize: "13px" }}>$590.00</span>
            </div>
            <div className="flex justify-between">
              <span className="font-sans text-[#666]" style={{ fontSize: "13px" }}>Shipping</span>
              <span className="font-sans font-medium text-[#4CAF50]" style={{ fontSize: "13px" }}>Free</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-sans font-bold text-bodyshop-charcoal" style={{ fontSize: "16px" }}>Total</span>
            <span className="font-serif font-bold text-bodyshop-charcoal" style={{ fontSize: "28px" }}>$590.00</span>
          </div>
        </div>
      </div>

      {/* Shipping address card */}
      <div className="flex justify-center" style={{ padding: "0 20px" }}>
        <div
          className="w-full flex flex-col gap-3 bg-white rounded-lg"
          style={{ maxWidth: "700px", padding: "24px", border: "1px solid #E0D5D5" }}
        >
          <span className="font-serif italic text-bodyshop-charcoal" style={{ fontSize: "20px" }}>Shipping Address</span>
          <div className="flex flex-col gap-1 font-sans text-[#888]" style={{ fontSize: "13px" }}>
            <span>Sarah Thompson</span>
            <span>123 Main Street, Port of Spain</span>
            <span>Trinidad & Tobago</span>
          </div>
          <span className="font-sans text-[#888]" style={{ fontSize: "13px" }}>
            Standard Shipping (5-7 business days)
          </span>
        </div>
      </div>

      {/* CTAs */}
      <div
        className="flex items-center justify-center gap-4 flex-wrap"
        style={{ padding: "40px 20px" }}
      >
        <Link
          to="/the-body-shop"
          className="inline-flex items-center justify-center bg-couture-gold text-white font-sans font-semibold tracking-[0.15em] hover:bg-couture-gold-dark transition rounded"
          style={{ fontSize: "13px", padding: "14px 28px" }}
        >
          Continue Shopping
        </Link>
        <Link
          to="/account/orders"
          className="inline-flex items-center justify-center border border-couture-gold text-couture-gold font-sans font-semibold tracking-[0.15em] hover:bg-couture-gold hover:text-white transition rounded bg-white"
          style={{ fontSize: "13px", padding: "14px 28px" }}
        >
          Track My Order
        </Link>
      </div>

      {/* You May Also Like */}
      {RELATED.length > 0 && (
        <section
          className="flex flex-col gap-9 bg-[#FAFAFA]"
          style={{ padding: "60px 80px" }}
        >
          <div className="flex flex-col items-center gap-3">
            <h2
              className="font-serif font-semibold text-bodyshop-charcoal tracking-[0.25em] text-center"
              style={{ fontSize: "28px" }}
            >
              YOU MAY ALSO LIKE
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {RELATED.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section
        className="flex flex-col md:flex-row items-center justify-center gap-8 bg-[#FDF6F6]"
        style={{ padding: "40px 60px" }}
      >
        <span className="font-serif italic text-bodyshop-charcoal" style={{ fontSize: "22px" }}>
          Subscribe to our newsletter
        </span>
        <form className="flex" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Enter your email address"
            className="h-[42px] px-4 font-sans text-[13px] border border-[#E0D5D5] focus:outline-none focus:border-bodyshop-blush bg-white"
            style={{ width: "280px" }}
          />
          <button
            type="submit"
            className="h-[42px] px-6 bg-bodyshop-blush text-white font-sans font-semibold tracking-[0.15em] text-[11px] hover:bg-bodyshop-blush-dark transition"
          >
            SUBSCRIBE
          </button>
        </form>
      </section>
    </div>
  );
}
