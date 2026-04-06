import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

// ── Placeholder product data (replace with Neon DB fetch) ─────────────────────
const PRODUCTS = [
  {
    id: "1",
    slug: "sienna-stiletto",
    name: "Sienna Stiletto",
    price: 485,
    image: "https://images.unsplash.com/photo-1551232864-95a17264ad12?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "2",
    slug: "monaco-mule",
    name: "Monaco Mule",
    price: 390,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "3",
    slug: "riviera-satchel",
    name: "Riviera Satchel",
    price: 720,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "4",
    slug: "capri-clutch",
    name: "Capri Clutch",
    price: 310,
    image: "https://images.unsplash.com/photo-1566150905458-1bf1460f4d11?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "5",
    slug: "porto-pump",
    name: "Porto Pump",
    price: 540,
    image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "6",
    slug: "milan-tote",
    name: "Milan Tote",
    price: 850,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "7",
    slug: "amalfi-sandal",
    name: "Amalfi Sandal",
    price: 295,
    image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "8",
    slug: "corsica-watch",
    name: "Corsica Watch",
    price: 1250,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
  },
];

const BLOG_POSTS = [
  {
    id: "1",
    tag: "STYLE GUIDE",
    title: "5 Ways to Style Your Summer Heels",
    desc: "From brunch to evening cocktails, discover how to transition your favourite heels through every occasion.",
    image: "https://images.unsplash.com/photo-1731412673523-93af46c2c1dd?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "2",
    tag: "TREND REPORT",
    title: "The Handbag Shapes Dominating 2026",
    desc: "Structured, slouchy, or sculptural — we break down the silhouettes every fashion editor is carrying this season.",
    image: "https://images.unsplash.com/photo-1584891376083-4d6ffd5f11f3?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "3",
    tag: "BRAND SPOTLIGHT",
    title: "Watches Worth Investing In Right Now",
    desc: "Timepieces that hold their value and elevate any outfit — our curated guide to the season's most coveted watches.",
    image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&w=600&q=80",
  },
];

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: typeof PRODUCTS[0] }) {
  return (
    <Link
      to={`/the-body-shop/products/${product.slug}`}
      className="group flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: "320px" }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Quick add on hover */}
        <div className="absolute bottom-0 left-0 right-0 bg-bodyshop-blush text-white flex items-center justify-center gap-2 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <ShoppingBag size={14} />
          <span className="font-sans font-semibold tracking-[0.15em]" style={{ fontSize: "11px" }}>
            QUICK ADD
          </span>
        </div>
      </div>

      {/* Info row */}
      <div className="flex items-center justify-between pt-[14px]">
        <div className="flex flex-col gap-1">
          <span className="font-sans font-medium text-bodyshop-charcoal" style={{ fontSize: "13px" }}>
            {product.name}
          </span>
          <span className="font-sans text-shared-grey-text" style={{ fontSize: "13px" }}>
            ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>
        <ShoppingBag size={18} className="text-[#CCCCCC] group-hover:text-bodyshop-blush transition-colors" />
      </div>
    </Link>
  );
}

// ── Blog Card ─────────────────────────────────────────────────────────────────
function BlogCard({ post }: { post: typeof BLOG_POSTS[0] }) {
  return (
    <div className="flex flex-col bg-white border border-[#EEEEEE] cursor-pointer group">
      <div className="overflow-hidden" style={{ height: "220px" }}>
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-[10px] p-5">
        <span
          className="font-sans font-semibold text-bodyshop-blush tracking-[0.2em]"
          style={{ fontSize: "9px" }}
        >
          {post.tag}
        </span>
        <h3
          className="font-serif font-semibold text-bodyshop-charcoal leading-[1.3]"
          style={{ fontSize: "20px" }}
        >
          {post.title}
        </h3>
        <p
          className="font-sans text-shared-grey-text leading-[1.6]"
          style={{ fontSize: "12px" }}
        >
          {post.desc}
        </p>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function BodyShopHome() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="flex flex-col md:flex-row" style={{ minHeight: "480px" }}>
        {/* Left: copy */}
        <div className="flex flex-col justify-center gap-6 bg-[#FAFAFA] px-6 py-12 md:w-1/2 md:px-20 md:py-0">
          <span
            className="font-sans font-semibold text-bodyshop-blush tracking-[0.3em]"
            style={{ fontSize: "10px" }}
          >
            SPRING / SUMMER 2026
          </span>
          <h1
            className="font-serif font-semibold text-bodyshop-charcoal leading-[1.1]"
            style={{ fontSize: "clamp(36px, 6vw, 56px)", letterSpacing: "2px" }}
          >
            ELEVATE<br />YOUR STYLE
          </h1>
          <p
            className="font-sans text-shared-grey-text leading-[1.7]"
            style={{ fontSize: "15px", maxWidth: "420px" }}
          >
            Discover curated luxury footwear, handbags, and accessories from the world's most coveted designers.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/the-body-shop/new"
              className="inline-flex items-center justify-center bg-bodyshop-blush text-white font-sans font-semibold tracking-[0.1em] transition hover:bg-bodyshop-blush-dark"
              style={{ fontSize: "12px", padding: "14px 32px", borderRadius: "2px" }}
            >
              Shop New Arrivals
            </Link>
            <Link
              to="/the-body-shop/sale"
              className="inline-flex items-center justify-center border border-bodyshop-charcoal text-bodyshop-charcoal font-sans font-medium tracking-[0.1em] transition hover:bg-bodyshop-charcoal hover:text-white"
              style={{ fontSize: "12px", padding: "14px 32px", borderRadius: "2px" }}
            >
              View Sale
            </Link>
          </div>
        </div>

        {/* Right: image */}
        <div
          className="flex-1 overflow-hidden"
          style={{
            minHeight: "280px",
            backgroundImage: "url('https://images.unsplash.com/photo-1480832941706-3070df53672d?auto=format&fit=crop&w=1080&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </section>

      {/* ── New Arrivals ── */}
      <section className="flex flex-col gap-10 px-4 py-12 md:px-[60px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2
            className="font-serif font-semibold text-bodyshop-charcoal tracking-[0.25em]"
            style={{ fontSize: "32px" }}
          >
            NEW ARRIVALS
          </h2>
          <Link
            to="/the-body-shop/new"
            className="font-sans text-bodyshop-blush hover:text-bodyshop-blush-dark transition"
            style={{ fontSize: "13px" }}
          >
            View All →
          </Link>
        </div>

        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {PRODUCTS.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {PRODUCTS.slice(4, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ── From the Journal ── */}
      <section className="flex flex-col gap-9 bg-[#FAFAFA] px-4 py-12 md:px-[60px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2
            className="font-serif font-semibold text-bodyshop-charcoal tracking-[0.25em]"
            style={{ fontSize: "32px" }}
          >
            FROM THE JOURNAL
          </h2>
          <span
            className="font-sans text-bodyshop-blush cursor-pointer hover:text-bodyshop-blush-dark transition"
            style={{ fontSize: "13px" }}
          >
            Read More →
          </span>
        </div>

        {/* Blog grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>

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
