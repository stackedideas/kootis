import { Link } from "react-router-dom";
import { ShoppingBag, Heart } from "lucide-react";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  originalPrice?: number;
  image: string;
  badge?: "NEW" | "SALE";
  discountPct?: number;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  productDetails?: string;
  shippingReturns?: string;
  careInstructions?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.salePrice !== undefined && product.originalPrice !== undefined;

  return (
    <Link
      to={`/the-body-shop/products/${product.slug}`}
      className="group flex flex-col shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-[#F8F8F8]" style={{ height: "320px" }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top-left: badge */}
        {product.badge && (
          <span
            className="absolute top-3 left-3 font-sans font-bold text-white tracking-[0.1em]"
            style={{
              fontSize: "10px",
              padding: "4px 10px",
              borderRadius: "2px",
              background: product.badge === "SALE" ? "#E8A0A0" : "#C9A96E",
            }}
          >
            {product.badge}
          </span>
        )}

        {/* Top-right: discount % */}
        {product.discountPct && (
          <span
            className="absolute top-3 right-3 font-sans font-bold text-white"
            style={{
              fontSize: "10px",
              padding: "4px 10px",
              borderRadius: "50px",
              background: "#333333",
            }}
          >
            -{product.discountPct}%
          </span>
        )}

        {/* Heart (no discount) */}
        {!product.discountPct && (
          <button
            type="button"
            className="absolute top-3 right-3 text-[#CCCCCC] hover:text-bodyshop-blush transition-colors"
            onClick={(e) => e.preventDefault()}
            aria-label="Add to wishlist"
          >
            <Heart size={20} />
          </button>
        )}

        {/* Quick add on hover */}
        <div className="absolute bottom-0 left-0 right-0 bg-bodyshop-blush text-white flex items-center justify-center gap-2 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <ShoppingBag size={14} />
          <span className="font-sans font-semibold tracking-[0.15em]" style={{ fontSize: "11px" }}>
            QUICK ADD
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-[6px] bg-white px-4 py-4">
        <span
          className="font-sans font-medium text-bodyshop-blush tracking-[0.2em]"
          style={{ fontSize: "10px" }}
        >
          {product.category.toUpperCase()}
        </span>
        <span
          className="font-serif font-semibold text-bodyshop-charcoal"
          style={{ fontSize: "18px" }}
        >
          {product.name}
        </span>

        {hasDiscount ? (
          <div className="flex items-center gap-2">
            <span className="font-sans text-[#AAAAAA] line-through" style={{ fontSize: "14px" }}>
              ${product.originalPrice!.toFixed(2)}
            </span>
            <span className="font-sans font-semibold text-bodyshop-blush" style={{ fontSize: "15px" }}>
              ${product.salePrice!.toFixed(2)}
            </span>
          </div>
        ) : (
          <span className="font-sans font-bold text-bodyshop-blush" style={{ fontSize: "15px" }}>
            ${product.price.toFixed(2)}
          </span>
        )}
      </div>
    </Link>
  );
}
