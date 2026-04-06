import { Link } from "react-router-dom";
import { ShieldCheck, Lock } from "lucide-react";

export default function CheckoutHeader() {
  return (
    <>
      <div
        className="flex items-center justify-between bg-white"
        style={{ padding: "16px 60px" }}
      >
        <Link to="/the-body-shop" className="flex items-center gap-2">
          <span
            className="font-serif font-bold text-bodyshop-charcoal"
            style={{ fontSize: "22px", letterSpacing: "3px" }}
          >
            THE BODY SHOP
          </span>
          <span className="font-serif italic text-bodyshop-blush" style={{ fontSize: "13px" }}>
            by Kootis
          </span>
        </Link>

        <div className="flex items-center gap-3 text-[#999]">
          <Lock size={14} />
          <span className="font-sans" style={{ fontSize: "12px" }}>
            Secure Checkout
          </span>
        </div>

        <div className="flex items-center gap-2 text-[#4CAF50]">
          <ShieldCheck size={16} />
          <span className="font-sans" style={{ fontSize: "12px" }}>
            SSL Encrypted
          </span>
        </div>
      </div>
      <div className="h-px w-full bg-[#F0F0F0]" />
    </>
  );
}
