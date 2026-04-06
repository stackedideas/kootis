import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, Star, ChevronDown, ChevronUp, Truck, RefreshCw, ShieldCheck } from "lucide-react";
import ProductCard from "@/components/bodyshop/ProductCard";
import { ALL_PRODUCTS } from "@/data/bodyshopProducts";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

const SIZES = ["35", "36", "37", "38", "39", "40", "41"];
const COLORS = [
  { name: "Nude Gold", hex: "#C9A96E" },
  { name: "Black", hex: "#333333" },
  { name: "Blush", hex: "#E8A0A0" },
];

// Accordion item
function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#F0F0F0]">
      <button
        className="flex items-center justify-between w-full py-4 font-sans font-semibold text-bodyshop-charcoal tracking-[0.05em] transition hover:text-bodyshop-blush"
        style={{ fontSize: "13px" }}
        onClick={() => setOpen((o) => !o)}
      >
        {title}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <div className="pb-4 font-sans text-shared-grey-text leading-[1.7]" style={{ fontSize: "13px" }}>
          {children}
        </div>
      )}
    </div>
  );
}

export default function BodyShopProductDetail() {
  const { slug } = useParams<{ slug: string }>();

  const product = ALL_PRODUCTS.find((p) => p.slug === slug) ?? {
    id: "demo",
    slug: "athena-strappy-heel",
    name: "Athena Strappy Heel",
    category: "Heels",
    price: 295,
    image:
      "https://images.unsplash.com/photo-1709282028322-35c1fb068ef8?auto=format&fit=crop&w=800&q=80",
    badge: undefined,
  };

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].name);
  const [qty, setQty] = useState(1);
  const addToCart = useCartStore((s) => s.addItem);
  const { toggleItem, isWishlisted } = useWishlistStore();
  const navigate = useNavigate();
  const wishlisted = isWishlisted(product.id);

  const related = ALL_PRODUCTS
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const thumbnails = [product.image, product.image, product.image];

  const displayPrice = product.salePrice ?? product.price;

  return (
    <div className="flex flex-col">
      {/* ── Breadcrumb ── */}
      <nav
        className="flex items-center gap-2 font-sans text-[#999] border-b border-[#F0F0F0] px-4 py-4 md:px-[60px] flex-wrap"
        style={{ fontSize: "12px" }}
      >
        <Link to="/the-body-shop" className="hover:text-bodyshop-blush transition">Home</Link>
        <span className="text-bodyshop-blush">&gt;</span>
        <Link to="/the-body-shop/shoes" className="hover:text-bodyshop-blush transition">Shoes</Link>
        <span className="text-bodyshop-blush">&gt;</span>
        <Link to="/the-body-shop/shoes" className="hover:text-bodyshop-blush transition">{product.category}</Link>
        <span className="text-bodyshop-blush">&gt;</span>
        <span className="text-bodyshop-charcoal">{product.name}</span>
      </nav>

      {/* ── Main section ── */}
      <div className="flex gap-8 flex-col md:flex-row px-4 py-8 md:px-[60px] md:py-10">
        {/* Left: images */}
        <div className="flex flex-col gap-3 shrink-0 w-full md:max-w-[520px]">
          <div className="overflow-hidden bg-[#F8F8F8] h-[320px] md:h-[520px]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-3">
            {thumbnails.map((src, i) => (
              <div
                key={i}
                className="overflow-hidden bg-[#F8F8F8] cursor-pointer border-2 border-transparent hover:border-bodyshop-blush transition"
                style={{ width: "96px", height: "96px" }}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: product info */}
        <div className="flex flex-col gap-4 flex-1">
          <span
            className="font-sans font-bold text-bodyshop-blush tracking-[0.2em]"
            style={{ fontSize: "11px" }}
          >
            {product.category.toUpperCase()}
          </span>

          <h1
            className="font-serif font-semibold text-bodyshop-charcoal"
            style={{ fontSize: "36px" }}
          >
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < 4 ? "text-bodyshop-blush fill-bodyshop-blush" : "text-[#CCCCCC]"}
              />
            ))}
            <span className="font-sans text-[#999]" style={{ fontSize: "12px" }}>
              (24 reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            {product.originalPrice && (
              <span className="font-sans text-[#AAAAAA] line-through" style={{ fontSize: "18px" }}>
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            <span
              className="font-sans font-bold text-bodyshop-blush"
              style={{ fontSize: "28px" }}
            >
              ${displayPrice.toFixed(2)}
            </span>
          </div>

          <div className="h-px bg-[#F0F0F0]" />

          {/* Description */}
          <p
            className="font-serif text-[#666666] leading-[1.6]"
            style={{ fontSize: "16px" }}
          >
            Elevate your look with the {product.name}. Crafted from premium Italian leather with delicate gold-tone hardware, this style features a cushioned insole for all-day comfort. Perfect for weddings, galas, and special evenings.
          </p>

          {/* Size selector */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-sans font-bold text-bodyshop-charcoal" style={{ fontSize: "13px" }}>
                Size
              </span>
              <button className="font-sans text-bodyshop-blush underline" style={{ fontSize: "12px" }}>
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className="w-11 h-11 font-sans font-medium transition border rounded"
                  style={{
                    fontSize: "13px",
                    background: selectedSize === s ? "#E8A0A0" : "transparent",
                    color: selectedSize === s ? "#FFFFFF" : "#555555",
                    borderColor: selectedSize === s ? "#E8A0A0" : "#E0D5D5",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color selector */}
          <div className="flex flex-col gap-3">
            <span className="font-sans font-bold text-bodyshop-charcoal" style={{ fontSize: "13px" }}>
              Color: {selectedColor}
            </span>
            <div className="flex gap-3">
              {COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  title={c.name}
                  className="w-8 h-8 rounded-full transition"
                  style={{
                    background: c.hex,
                    outline: selectedColor === c.name ? `2px solid ${c.hex}` : "none",
                    outlineOffset: "3px",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <span className="font-sans font-bold text-bodyshop-charcoal" style={{ fontSize: "13px" }}>
              Qty
            </span>
            <div className="flex items-center border border-[#E0D5D5]">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 font-sans text-lg text-[#555] hover:bg-[#FDF6F6] transition"
              >
                -
              </button>
              <span
                className="w-10 h-10 flex items-center justify-center font-sans font-medium text-bodyshop-charcoal"
                style={{ fontSize: "14px" }}
              >
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-10 font-sans text-lg text-[#555] hover:bg-[#FDF6F6] transition"
              >
                +
              </button>
            </div>
          </div>

          {/* CTA buttons */}
          <button
            onClick={() => {
              addToCart({
                id: product.id,
                slug: product.slug,
                name: product.name,
                category: product.category,
                price: product.salePrice ?? product.price,
                originalPrice: product.originalPrice,
                image: product.image,
                size: selectedSize ?? undefined,
                color: selectedColor,
                quantity: qty,
              });
              navigate("/the-body-shop/cart");
            }}
            className="w-full h-[52px] bg-bodyshop-blush text-white font-sans font-semibold tracking-[0.15em] hover:bg-bodyshop-blush-dark transition flex items-center justify-center gap-2 rounded"
            style={{ fontSize: "13px" }}
          >
            <ShoppingBag size={16} />
            ADD TO CART
          </button>
          <button
            onClick={() => toggleItem({
              id: product.id,
              slug: product.slug,
              name: product.name,
              category: product.category,
              price: product.price,
              salePrice: product.salePrice,
              originalPrice: product.originalPrice,
              image: product.image,
              badge: product.badge,
            })}
            className="w-full h-[52px] border border-bodyshop-blush font-sans font-semibold tracking-[0.15em] transition flex items-center justify-center gap-2 rounded bg-white"
            style={{
              fontSize: "13px",
              color: wishlisted ? "#FFFFFF" : "#E8A0A0",
              background: wishlisted ? "#E8A0A0" : "white",
            }}
          >
            <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
            {wishlisted ? "WISHLISTED" : "ADD TO WISHLIST"}
          </button>

          {/* Delivery info */}
          <div className="flex flex-col gap-2 py-4 border-t border-[#F0F0F0]">
            {[
              { icon: Truck, text: "Free delivery on orders over $500 TTD" },
              { icon: RefreshCw, text: "Free returns within 14 days" },
              { icon: ShieldCheck, text: "Secure checkout via WiPay" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon size={14} className="text-bodyshop-blush shrink-0" />
                <span className="font-sans text-[#666]" style={{ fontSize: "13px" }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Accordion */}
          <AccordionItem title="Product Details">
            Upper: 100% premium Italian leather. Sole: Rubber. Heel height: 9 cm.
            Lined with soft suede interior. Gold-tone hardware details. Made in Italy.
          </AccordionItem>
          <AccordionItem title="Shipping & Returns">
            Standard delivery 3–5 business days. Express available at checkout.
            Free returns within 14 days of delivery — items must be unworn and in original packaging.
          </AccordionItem>
          <AccordionItem title="Care Instructions">
            Wipe clean with a soft, dry cloth. Store in the provided dust bag.
            Avoid contact with water and direct sunlight. Do not machine wash.
          </AccordionItem>
        </div>
      </div>

      {/* ── You May Also Like ── */}
      {related.length > 0 && (
        <section className="flex flex-col gap-9 bg-[#FAFAFA] px-4 py-12 md:px-[60px]">
          <div className="flex items-center justify-between">
            <h2
              className="font-serif font-semibold text-bodyshop-charcoal tracking-[0.25em]"
              style={{ fontSize: "28px" }}
            >
              YOU MAY ALSO LIKE
            </h2>
            <Link
              to="/the-body-shop/shoes"
              className="font-sans text-bodyshop-blush hover:text-bodyshop-blush-dark transition"
              style={{ fontSize: "13px" }}
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── Newsletter ── */}
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
