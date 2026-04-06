import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

const FREE_DELIVERY_THRESHOLD = 500;

export default function BodyShopCart() {
  const { items, updateQuantity, removeItem, subtotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const sub = subtotal();
  const isFreeDelivery = sub >= FREE_DELIVERY_THRESHOLD;
  const total = sub - discount;

  function handleApplyPromo() {
    if (promoCode.toUpperCase() === "KOOTIS10") {
      setDiscount(sub * 0.1);
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-32">
        <h2 className="font-serif italic text-bodyshop-charcoal" style={{ fontSize: "32px" }}>
          Your cart is empty
        </h2>
        <p className="font-sans text-[#999]" style={{ fontSize: "15px" }}>
          Discover our latest arrivals and add your favourites.
        </p>
        <Link
          to="/the-body-shop/new"
          className="bg-bodyshop-blush text-white font-sans font-semibold tracking-[0.15em] hover:bg-bodyshop-blush-dark transition"
          style={{ fontSize: "12px", padding: "14px 40px" }}
        >
          SHOP NEW ARRIVALS
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Heading */}
      <div className="flex items-end gap-3 px-4 pt-8 pb-6 md:px-[60px] md:pt-10">
        <h1
          className="font-serif font-semibold text-bodyshop-charcoal tracking-[0.25em]"
          style={{ fontSize: "32px" }}
        >
          YOUR CART
        </h1>
        <span className="font-sans text-[#999] mb-1" style={{ fontSize: "14px" }}>
          ({items.reduce((a, i) => a + i.quantity, 0)} items)
        </span>
      </div>

      {/* Two-col layout */}
      <div className="flex flex-col lg:flex-row gap-10 items-start px-4 pb-12 md:px-[60px]">
        {/* Left: cart items */}
        <div className="flex flex-col flex-1">
          {items.map((item, idx) => (
            <div key={`${item.id}-${item.size}-${item.color}`}>
              <div className="flex items-center gap-5 py-6">
                {/* Image */}
                <div className="w-20 h-20 overflow-hidden shrink-0 bg-[#F8F8F8]">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex flex-col gap-1 flex-1">
                  <span className="font-serif font-semibold text-bodyshop-charcoal" style={{ fontSize: "18px" }}>
                    {item.name}
                  </span>
                  <span className="font-sans font-bold text-bodyshop-blush tracking-[0.2em]" style={{ fontSize: "10px" }}>
                    {item.category.toUpperCase()}
                  </span>
                  <span className="font-sans text-[#999]" style={{ fontSize: "12px" }}>
                    {[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`].filter(Boolean).join(" | ")}
                  </span>
                  <span className="font-sans font-bold text-bodyshop-blush" style={{ fontSize: "16px" }}>
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                {/* Qty stepper */}
                <div className="flex items-center border border-[#E0D5D5]">
                  <button
                    onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                    className="w-9 h-9 text-[#555] hover:bg-[#FDF6F6] transition font-sans text-lg"
                  >
                    -
                  </button>
                  <span className="w-9 h-9 flex items-center justify-center font-sans font-medium text-bodyshop-charcoal" style={{ fontSize: "14px" }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                    className="w-9 h-9 text-[#555] hover:bg-[#FDF6F6] transition font-sans text-lg"
                  >
                    +
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id, item.size, item.color)}
                  className="text-[#CCCCCC] hover:text-bodyshop-blush transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              {idx < items.length - 1 && <div className="h-px bg-[#F0F0F0]" />}
            </div>
          ))}

          {/* Actions row */}
          <div className="flex items-center justify-between pt-6">
            <Link
              to="/the-body-shop/new"
              className="flex items-center gap-2 font-sans text-bodyshop-blush hover:text-bodyshop-blush-dark transition"
              style={{ fontSize: "13px" }}
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
            <button
              onClick={() => clearCart()}
              className="font-sans text-bodyshop-blush border border-bodyshop-blush hover:bg-bodyshop-blush hover:text-white transition rounded"
              style={{ fontSize: "13px", padding: "10px 24px" }}
            >
              Clear Cart
            </button>
          </div>

          {/* Promo code */}
          <div className="flex mt-6">
            <input
              type="text"
              placeholder="ENTER PROMO CODE"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 h-11 px-4 font-sans text-[13px] border border-[#E0D5D5] focus:outline-none focus:border-bodyshop-blush tracking-[0.1em] placeholder:text-[#BBB] placeholder:text-[12px]"
            />
            <button
              onClick={handleApplyPromo}
              className="h-11 px-7 bg-bodyshop-blush text-white font-sans font-bold tracking-[0.1em] hover:bg-bodyshop-blush-dark transition shrink-0"
              style={{ fontSize: "13px" }}
            >
              Apply
            </button>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div
          className="flex flex-col gap-5 bg-white rounded w-full lg:max-w-[460px]"
          style={{ padding: "32px", border: "1px solid rgba(201,169,110,0.2)" }}
        >
          <span className="font-sans font-bold text-bodyshop-charcoal tracking-[0.2em]" style={{ fontSize: "13px" }}>
            ORDER SUMMARY
          </span>
          <div className="h-px bg-[#F0F0F0]" />

          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <span className="font-sans text-[#666]" style={{ fontSize: "14px" }}>Subtotal</span>
              <span className="font-sans font-medium text-bodyshop-charcoal" style={{ fontSize: "14px" }}>${sub.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-sans text-[#666]" style={{ fontSize: "14px" }}>Delivery</span>
              <span className="font-sans font-medium" style={{ fontSize: "14px", color: isFreeDelivery ? "#4CAF50" : "#333" }}>
                {isFreeDelivery ? "Free" : "Calculated at checkout"}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <span className="font-sans text-[#666]" style={{ fontSize: "14px" }}>Discount</span>
                <span className="font-sans font-medium text-bodyshop-blush" style={{ fontSize: "14px" }}>-${discount.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="h-px bg-[#F0F0F0]" />

          <div className="flex items-center justify-between">
            <span className="font-sans font-bold text-bodyshop-charcoal" style={{ fontSize: "18px" }}>Total</span>
            <span className="font-serif font-bold text-bodyshop-charcoal" style={{ fontSize: "28px" }}>${total.toFixed(2)}</span>
          </div>

          {/* Payment icons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-sans text-[#999]" style={{ fontSize: "11px" }}>We accept:</span>
            {["VISA", "MC", "WiPay"].map((card) => (
              <span
                key={card}
                className="border border-[#E0E0E0] rounded font-sans font-bold px-2 py-1"
                style={{ fontSize: "8px", color: card === "VISA" ? "#1A1F71" : card === "MC" ? "#EB001B" : "#E8A0A0" }}
              >
                {card}
              </span>
            ))}
          </div>

          <button
            onClick={() => navigate("/the-body-shop/checkout")}
            className="w-full h-[52px] bg-bodyshop-blush text-white font-sans font-bold tracking-[0.2em] hover:bg-bodyshop-blush-dark transition rounded"
            style={{ fontSize: "14px" }}
          >
            PROCEED TO CHECKOUT
          </button>
          <div className="flex justify-center">
            <Link
              to="/the-body-shop/new"
              className="font-sans text-bodyshop-blush hover:text-bodyshop-blush-dark transition"
              style={{ fontSize: "13px" }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-6 bg-[#FDF6F6] px-4 py-10 md:px-[60px]">
        <span className="font-serif italic text-bodyshop-charcoal text-center" style={{ fontSize: "22px" }}>
          Subscribe to our newsletter
        </span>
        <form className="flex w-full max-w-[440px] md:w-auto" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 h-[42px] px-4 font-sans text-[13px] border border-[#E0D5D5] focus:outline-none focus:border-bodyshop-blush bg-white min-w-0"
          />
          <button
            type="submit"
            className="h-[42px] px-6 bg-bodyshop-blush text-white font-sans font-semibold tracking-[0.15em] text-[11px] hover:bg-bodyshop-blush-dark transition shrink-0"
          >
            SUBSCRIBE
          </button>
        </form>
      </section>
    </div>
  );
}
