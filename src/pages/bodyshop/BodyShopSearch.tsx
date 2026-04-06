import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import ProductCard from "@/components/bodyshop/ProductCard";
import { ALL_PRODUCTS } from "@/data/bodyshopProducts";

const FILTERS = ["All", "Shoes", "Handbags", "Watches", "Accessories"];
const SORT_OPTIONS = ["Newest", "Price: Low to High", "Price: High to Low"];

export default function BodyShopSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [submitted, setSubmitted] = useState(initialQuery !== "");

  const categoryMap: Record<string, string[]> = {
    Shoes: ["Heels", "Flats", "Boots", "Sandals", "Sneakers"],
    Handbags: ["Totes", "Clutches", "Crossbody", "Satchels"],
    Watches: ["Luxury", "Sport", "Casual"],
    Accessories: ["Scarves", "Belts", "Jewellery", "Eyewear"],
  };

  const filtered = ALL_PRODUCTS.filter((p) => {
    const q = initialQuery.toLowerCase();
    const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    const matchesFilter = activeFilter === "All" || (categoryMap[activeFilter] ?? []).includes(p.category);
    return matchesQuery && matchesFilter;
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchParams(query ? { q: query } : {});
    setSubmitted(true);
  }

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setQuery(q);
    setSubmitted(q !== "");
  }, [searchParams]);

  return (
    <div className="flex flex-col">
      {/* Search hero */}
      <section
        className="flex flex-col items-center justify-center gap-5 bg-bodyshop-blush"
        style={{ padding: "40px 80px" }}
      >
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-3 bg-white rounded-full h-[52px] w-full max-w-[600px]"
          style={{ padding: "0 20px" }}
        >
          <Search size={18} className="text-[#CCC] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for shoes, handbags, watches..."
            className="flex-1 font-sans text-[14px] text-bodyshop-charcoal focus:outline-none placeholder:text-[#BBB] bg-transparent"
          />
          <button
            type="submit"
            className="shrink-0 font-sans font-semibold text-bodyshop-blush hover:text-bodyshop-blush-dark transition"
            style={{ fontSize: "13px" }}
          >
            Search
          </button>
        </form>

        {submitted && (
          <p className="font-sans text-white/90 text-center" style={{ fontSize: "14px" }}>
            Showing {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{initialQuery}&rdquo;
          </p>
        )}
      </section>

      {/* Filter + sort bar */}
      {submitted && (
        <div
          className="flex items-center justify-between border-b border-[#E0D5D5] bg-white"
          style={{ padding: "16px 80px" }}
        >
          {/* Filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="font-sans font-medium transition"
                style={{
                  fontSize: "12px",
                  padding: "8px 20px",
                  borderRadius: "50px",
                  background: activeFilter === f ? "#E8A0A0" : "transparent",
                  color: activeFilter === f ? "#FFFFFF" : "#555555",
                  border: activeFilter === f ? "none" : "1px solid #E0D5D5",
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="font-sans text-[#666] border border-[#E0D5D5] rounded h-9 px-3 focus:outline-none focus:border-bodyshop-blush bg-white"
            style={{ fontSize: "12px" }}
          >
            {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
      )}

      {/* Results grid */}
      {submitted && (
        <div style={{ padding: "40px 80px" }}>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 py-24 text-center">
              <Search size={48} className="text-[#DDD]" strokeWidth={1.5} />
              <h2 className="font-serif italic text-bodyshop-charcoal" style={{ fontSize: "28px" }}>
                No results found
              </h2>
              <p className="font-sans text-[#999]" style={{ fontSize: "15px" }}>
                We couldn't find anything matching &ldquo;{initialQuery}&rdquo;. Try a different search term.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Pre-search: show popular categories */}
      {!submitted && (
        <div
          className="flex flex-col gap-6"
          style={{ padding: "48px 80px" }}
        >
          <h2 className="font-serif font-semibold text-bodyshop-charcoal tracking-[0.2em]" style={{ fontSize: "22px" }}>
            POPULAR CATEGORIES
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {["Shoes", "Handbags", "Watches", "Accessories"].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setQuery(cat);
                  setSearchParams({ q: cat });
                  setSubmitted(true);
                }}
                className="h-24 bg-[#FAFAFA] border border-[#E0D5D5] rounded font-serif italic text-bodyshop-charcoal hover:border-bodyshop-blush hover:text-bodyshop-blush transition"
                style={{ fontSize: "20px" }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

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
