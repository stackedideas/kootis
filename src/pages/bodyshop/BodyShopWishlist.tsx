import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import ProductCard from "@/components/bodyshop/ProductCard";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";

export default function BodyShopWishlist() {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-32">
        <Heart size={48} className="text-[#DDD]" strokeWidth={1.5} />
        <h2 className="font-serif italic text-bodyshop-charcoal" style={{ fontSize: "32px" }}>
          Your wishlist is empty
        </h2>
        <p className="font-sans text-[#999]" style={{ fontSize: "15px" }}>
          Save your favourite pieces and shop them later.
        </p>
        <Link
          to="/the-body-shop/new"
          className="bg-bodyshop-blush text-white font-sans font-semibold tracking-[0.15em] hover:bg-bodyshop-blush-dark transition"
          style={{ fontSize: "12px", padding: "14px 40px" }}
        >
          EXPLORE NEW ARRIVALS
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Heading */}
      <div className="flex items-end gap-3" style={{ padding: "32px 80px" }}>
        <h1 className="font-serif text-bodyshop-charcoal tracking-[0.1em]" style={{ fontSize: "32px" }}>
          MY WISHLIST
        </h1>
        <span className="font-sans text-[#888] mb-1" style={{ fontSize: "14px" }}>
          ({items.length} items saved)
        </span>
      </div>

      {/* Grid */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
        style={{ padding: "0 80px 40px" }}
      >
        {items.map((item) => (
          <div key={item.id} className="relative group">
            <ProductCard product={item} />
            {/* Overlay actions */}
            <div className="absolute top-[336px] left-0 right-0 flex gap-2 px-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  addToCart({
                    id: item.id,
                    slug: item.slug,
                    name: item.name,
                    category: item.category,
                    price: item.salePrice ?? item.price,
                    originalPrice: item.originalPrice,
                    image: item.image,
                  });
                  removeItem(item.id);
                }}
                className="flex-1 h-10 bg-bodyshop-blush text-white font-sans font-semibold tracking-[0.1em] hover:bg-bodyshop-blush-dark transition"
                style={{ fontSize: "11px" }}
              >
                ADD TO CART
              </button>
              <button
                onClick={() => removeItem(item.id)}
                className="h-10 px-3 border border-[#E0D5D5] text-[#999] hover:border-red-300 hover:text-red-400 transition bg-white"
              >
                <Heart size={14} fill="currentColor" />
              </button>
            </div>
          </div>
        ))}
      </div>

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
