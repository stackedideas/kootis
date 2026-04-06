import { useState } from "react";
import { ChevronUp, ChevronDown, ShieldCheck, RotateCcw } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

const FREE_DELIVERY_THRESHOLD = 500;

export default function CheckoutOrderSummary({ shippingCost = 0 }: { shippingCost?: number }) {
  const [collapsed, setCollapsed] = useState(false);
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryCost = isFreeDelivery ? 0 : shippingCost;
  const total = subtotal + deliveryCost;

  return (
    <div
      className="flex flex-col gap-5 bg-white rounded-lg"
      style={{ padding: "28px", border: "1px solid rgba(201,169,110,0.2)" }}
    >
      {/* Header */}
      <button
        className="flex items-center justify-between w-full"
        onClick={() => setCollapsed((c) => !c)}
      >
        <span
          className="font-sans font-bold text-bodyshop-charcoal tracking-[0.2em]"
          style={{ fontSize: "12px" }}
        >
          ORDER SUMMARY
        </span>
        {collapsed ? <ChevronDown size={16} className="text-[#999]" /> : <ChevronUp size={16} className="text-[#999]" />}
      </button>

      <div className="h-px bg-[#F0F0F0]" />

      {/* Items */}
      {!collapsed && (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center gap-4">
              <div className="w-14 h-14 rounded overflow-hidden shrink-0 bg-[#F8F8F8]">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-0.5 flex-1">
                <span className="font-sans font-medium text-bodyshop-charcoal" style={{ fontSize: "13px" }}>
                  {item.name}
                </span>
                <span className="font-sans text-[#999]" style={{ fontSize: "11px" }}>
                  Qty: {item.quantity}
                  {item.size ? ` · Size ${item.size}` : ""}
                  {item.color ? ` · ${item.color}` : ""}
                </span>
              </div>
              <span className="font-sans font-semibold text-bodyshop-charcoal" style={{ fontSize: "13px" }}>
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="h-px bg-[#F0F0F0]" />

      {/* Totals */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="font-sans text-[#666]" style={{ fontSize: "13px" }}>Subtotal</span>
          <span className="font-sans font-medium text-bodyshop-charcoal" style={{ fontSize: "13px" }}>
            ${subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-sans text-[#666]" style={{ fontSize: "13px" }}>Shipping</span>
          <span
            className="font-sans font-medium"
            style={{ fontSize: "13px", color: isFreeDelivery ? "#4CAF50" : "#333333" }}
          >
            {isFreeDelivery ? "Free" : `$${deliveryCost.toFixed(2)}`}
          </span>
        </div>
      </div>

      <div className="h-px bg-[#F0F0F0]" />

      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="font-sans font-bold text-bodyshop-charcoal" style={{ fontSize: "16px" }}>Total</span>
        <span className="font-serif font-bold text-bodyshop-charcoal" style={{ fontSize: "24px" }}>
          ${total.toFixed(2)}
        </span>
      </div>

      {/* Payment icons + trust */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-sans text-[#999]" style={{ fontSize: "11px" }}>We accept:</span>
        <span className="border border-[#E0E0E0] rounded px-2 py-1 font-sans font-bold text-[#1A1F71]" style={{ fontSize: "8px" }}>
          VISA
        </span>
        <span className="border border-[#E0E0E0] rounded px-2 py-1 font-sans font-bold text-[#EB001B]" style={{ fontSize: "8px" }}>
          MC
        </span>
        <span className="border border-[#E0E0E0] rounded px-2 py-1 font-sans font-bold text-bodyshop-blush" style={{ fontSize: "8px" }}>
          WiPay
        </span>
      </div>

      <div className="flex items-center justify-center gap-5">
        <div className="flex items-center gap-1 text-[#999]">
          <ShieldCheck size={14} className="text-[#4CAF50]" />
          <span className="font-sans" style={{ fontSize: "11px" }}>SSL Secure</span>
        </div>
        <div className="flex items-center gap-1 text-[#999]">
          <RotateCcw size={14} className="text-bodyshop-blush" />
          <span className="font-sans" style={{ fontSize: "11px" }}>Free Returns</span>
        </div>
      </div>
    </div>
  );
}
