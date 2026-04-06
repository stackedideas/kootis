import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Truck } from "lucide-react";
import CheckoutHeader from "@/components/bodyshop/CheckoutHeader";
import CheckoutProgress from "@/components/bodyshop/CheckoutProgress";
import CheckoutOrderSummary from "@/components/bodyshop/CheckoutOrderSummary";

const SHIPPING_OPTIONS = [
  { id: "standard", label: "Standard Shipping", eta: "5-7 business days", price: 0, tag: "Free" },
  { id: "express", label: "Express Shipping", eta: "2-3 business days", price: 75, tag: "TTD $75" },
  { id: "overnight", label: "Overnight Delivery", eta: "Next business day", price: 150, tag: "TTD $150" },
];

export default function BodyShopCheckoutShipping() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("standard");

  const option = SHIPPING_OPTIONS.find((o) => o.id === selected)!;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate("/the-body-shop/checkout/payment");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9]">
      <CheckoutHeader />
      <CheckoutProgress currentStep={2} />

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
            SHIPPING METHOD
          </span>

          <div className="flex flex-col gap-3">
            {SHIPPING_OPTIONS.map((opt) => (
              <label
                key={opt.id}
                className="flex items-center justify-between border rounded cursor-pointer transition"
                style={{
                  padding: "16px 20px",
                  borderColor: selected === opt.id ? "#E8A0A0" : "#E0D5D5",
                  background: selected === opt.id ? "#FDF6F6" : "white",
                }}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="shipping"
                    value={opt.id}
                    checked={selected === opt.id}
                    onChange={() => setSelected(opt.id)}
                    className="accent-bodyshop-blush"
                  />
                  <Truck size={16} className="text-bodyshop-blush" />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-sans font-semibold text-bodyshop-charcoal" style={{ fontSize: "13px" }}>
                      {opt.label}
                    </span>
                    <span className="font-sans text-[#999]" style={{ fontSize: "12px" }}>
                      {opt.eta}
                    </span>
                  </div>
                </div>
                <span
                  className="font-sans font-semibold"
                  style={{ fontSize: "13px", color: opt.price === 0 ? "#4CAF50" : "#333333" }}
                >
                  {opt.tag}
                </span>
              </label>
            ))}
          </div>

          <button
            type="submit"
            className="w-full h-[52px] bg-bodyshop-blush text-white font-sans font-bold tracking-[0.2em] hover:bg-bodyshop-blush-dark transition rounded"
            style={{ fontSize: "14px" }}
          >
            CONTINUE TO PAYMENT
          </button>
          <div className="flex justify-center">
            <Link
              to="/the-body-shop/checkout"
              className="font-sans text-bodyshop-blush hover:text-bodyshop-blush-dark transition"
              style={{ fontSize: "13px" }}
            >
              Return to Address
            </Link>
          </div>
        </div>

        {/* Right */}
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <CheckoutOrderSummary shippingCost={option.price} />
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
