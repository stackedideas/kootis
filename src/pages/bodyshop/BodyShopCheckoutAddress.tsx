import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CheckoutHeader from "@/components/bodyshop/CheckoutHeader";
import CheckoutProgress from "@/components/bodyshop/CheckoutProgress";
import CheckoutOrderSummary from "@/components/bodyshop/CheckoutOrderSummary";

const COUNTRIES = ["Trinidad & Tobago", "Barbados", "Jamaica", "Guyana", "USA", "Canada", "United Kingdom"];

function Field({ label, placeholder, type = "text", required = false }:
  { label: string; placeholder: string; type?: string; required?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-sans font-medium text-bodyshop-charcoal tracking-[0.05em]" style={{ fontSize: "11px" }}>
        {label}{required && " *"}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        className="h-12 px-4 font-sans text-[13px] border border-[#E0D5D5] rounded focus:outline-none focus:border-bodyshop-blush bg-white transition placeholder:text-[#BBB]"
      />
    </div>
  );
}

export default function BodyShopCheckoutAddress() {
  const navigate = useNavigate();
  const [country, setCountry] = useState("Trinidad & Tobago");
  const [newsletter, setNewsletter] = useState(true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate("/the-body-shop/checkout/shipping");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9]">
      <CheckoutHeader />

      <CheckoutProgress currentStep={1} />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row gap-10 items-start"
        style={{ padding: "32px 60px 48px" }}
      >
        {/* Left: Form */}
        <div
          className="flex flex-col gap-7 bg-white rounded-lg flex-1"
          style={{ padding: "40px" }}
        >
          {/* Contact info */}
          <div className="flex flex-col gap-4">
            <span className="font-sans font-bold text-bodyshop-charcoal tracking-[0.2em]" style={{ fontSize: "12px" }}>
              CONTACT INFORMATION
            </span>
            <Field label="Email address" placeholder="you@example.com" type="email" required />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
                className="w-3.5 h-3.5 border border-[#E0D5D5] accent-bodyshop-blush"
              />
              <span className="font-sans text-[#666]" style={{ fontSize: "12px" }}>
                Keep me updated on news and offers
              </span>
            </label>
          </div>

          {/* Shipping address */}
          <div className="flex flex-col gap-4">
            <span className="font-sans font-bold text-bodyshop-charcoal tracking-[0.2em]" style={{ fontSize: "12px" }}>
              SHIPPING ADDRESS
            </span>

            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name" placeholder="Sarah" required />
              <Field label="Last Name" placeholder="Thompson" required />
            </div>
            <Field label="Address Line 1" placeholder="123 Main Street" required />
            <Field label="Address Line 2" placeholder="Apt, suite, floor (optional)" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="City" placeholder="Port of Spain" required />
              <Field label="Postcode" placeholder="000000" />
            </div>

            {/* Country select */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans font-medium text-bodyshop-charcoal tracking-[0.05em]" style={{ fontSize: "11px" }}>
                Country *
              </label>
              <div className="relative">
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full h-12 px-4 font-sans text-[13px] border border-[#E0D5D5] rounded focus:outline-none focus:border-bodyshop-blush bg-white appearance-none"
                >
                  {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#999]">▾</span>
              </div>
            </div>

            <Field label="Phone Number" placeholder="+1 (868) 555-0000" type="tel" required />
          </div>

          {/* CTAs */}
          <button
            type="submit"
            className="w-full h-[52px] bg-bodyshop-blush text-white font-sans font-bold tracking-[0.2em] hover:bg-bodyshop-blush-dark transition rounded"
            style={{ fontSize: "14px" }}
          >
            CONTINUE TO SHIPPING
          </button>
          <div className="flex justify-center">
            <Link
              to="/the-body-shop/cart"
              className="font-sans text-bodyshop-blush hover:text-bodyshop-blush-dark transition"
              style={{ fontSize: "13px" }}
            >
              Return to Cart
            </Link>
          </div>
        </div>

        {/* Right: Order summary */}
        <div style={{ width: "100%", maxWidth: "480px" }}>
          <CheckoutOrderSummary />
        </div>
      </form>

      {/* Minimal footer */}
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
