import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, CreditCard } from "lucide-react";
import CheckoutHeader from "@/components/bodyshop/CheckoutHeader";
import CheckoutProgress from "@/components/bodyshop/CheckoutProgress";
import CheckoutOrderSummary from "@/components/bodyshop/CheckoutOrderSummary";
import { useCartStore } from "@/store/cartStore";

export default function BodyShopCheckoutPayment() {
  const navigate = useNavigate();
  const clearCart = useCartStore((s) => s.clearCart);
  const [method, setMethod] = useState<"card" | "wipay">("card");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire to WiPay API or Stripe for card
    clearCart();
    navigate("/the-body-shop/order-confirmation");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9]">
      <CheckoutHeader />
      <CheckoutProgress currentStep={3} />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row gap-10 items-start"
        style={{ padding: "32px 60px 48px" }}
      >
        {/* Left */}
        <div
          className="flex flex-col gap-6 bg-white rounded-lg flex-1"
          style={{ padding: "40px" }}
        >
          <span className="font-sans font-bold text-bodyshop-charcoal tracking-[0.2em]" style={{ fontSize: "12px" }}>
            PAYMENT METHOD
          </span>

          {/* Method toggle */}
          <div className="flex gap-3">
            {(["card", "wipay"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className="flex items-center gap-2 border rounded px-4 py-3 font-sans font-semibold transition"
                style={{
                  fontSize: "12px",
                  borderColor: method === m ? "#E8A0A0" : "#E0D5D5",
                  background: method === m ? "#FDF6F6" : "white",
                  color: method === m ? "#E8A0A0" : "#666",
                }}
              >
                <CreditCard size={14} />
                {m === "card" ? "Credit / Debit Card" : "WiPay"}
              </button>
            ))}
          </div>

          {method === "card" ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-sans font-medium text-bodyshop-charcoal" style={{ fontSize: "11px" }}>Card Number *</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                  className="h-12 px-4 font-sans text-[13px] border border-[#E0D5D5] rounded focus:outline-none focus:border-bodyshop-blush bg-white tracking-[0.1em] placeholder:text-[#BBB]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-sans font-medium text-bodyshop-charcoal" style={{ fontSize: "11px" }}>Name on Card *</label>
                <input
                  type="text"
                  placeholder="Sarah Thompson"
                  required
                  className="h-12 px-4 font-sans text-[13px] border border-[#E0D5D5] rounded focus:outline-none focus:border-bodyshop-blush bg-white placeholder:text-[#BBB]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans font-medium text-bodyshop-charcoal" style={{ fontSize: "11px" }}>Expiry *</label>
                  <input
                    type="text"
                    placeholder="MM / YY"
                    maxLength={7}
                    required
                    className="h-12 px-4 font-sans text-[13px] border border-[#E0D5D5] rounded focus:outline-none focus:border-bodyshop-blush bg-white placeholder:text-[#BBB]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans font-medium text-bodyshop-charcoal" style={{ fontSize: "11px" }}>CVC *</label>
                  <input
                    type="text"
                    placeholder="123"
                    maxLength={4}
                    required
                    className="h-12 px-4 font-sans text-[13px] border border-[#E0D5D5] rounded focus:outline-none focus:border-bodyshop-blush bg-white placeholder:text-[#BBB]"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div
              className="flex flex-col items-center gap-4 border border-[#E0D5D5] rounded p-8 text-center"
            >
              <span className="font-serif italic text-bodyshop-charcoal" style={{ fontSize: "20px" }}>
                Pay with WiPay
              </span>
              <p className="font-sans text-[#999]" style={{ fontSize: "13px" }}>
                You'll be redirected to WiPay's secure payment portal to complete your purchase.
              </p>
            </div>
          )}

          {/* Security notice */}
          <div className="flex items-center gap-2 text-[#4CAF50]">
            <ShieldCheck size={14} />
            <span className="font-sans" style={{ fontSize: "12px" }}>
              Your payment information is SSL encrypted and secure
            </span>
          </div>

          <button
            type="submit"
            className="w-full h-[52px] bg-bodyshop-blush text-white font-sans font-bold tracking-[0.2em] hover:bg-bodyshop-blush-dark transition rounded"
            style={{ fontSize: "14px" }}
          >
            PLACE ORDER
          </button>
          <div className="flex justify-center">
            <Link
              to="/the-body-shop/checkout/shipping"
              className="font-sans text-bodyshop-blush hover:text-bodyshop-blush-dark transition"
              style={{ fontSize: "13px" }}
            >
              Return to Shipping
            </Link>
          </div>
        </div>

        {/* Right */}
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <CheckoutOrderSummary />
        </div>
      </form>

      <div
        className="flex items-center justify-between border-t border-[#F0F0F0] bg-white mt-auto"
        style={{ padding: "24px 60px" }}
      >
        <span className="font-sans text-[#999]" style={{ fontSize: "11px" }}>
          © 2026 The Body Shop by Kootis. All Rights Reserved.
        </span>
        <div className="flex gap-5">
          <a href="#" className="font-sans text-[#999] hover:text-bodyshop-blush transition" style={{ fontSize: "11px" }}>Privacy Policy</a>
          <a href="#" className="font-sans text-[#999] hover:text-bodyshop-blush transition" style={{ fontSize: "11px" }}>Terms of Service</a>
        </div>
      </div>
    </div>
  );
}
