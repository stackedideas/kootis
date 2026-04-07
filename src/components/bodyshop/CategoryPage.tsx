import { useState, ReactNode } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard, { Product } from "./ProductCard";

const SORT_OPTIONS = ["Newest", "Price: Low to High", "Price: High to Low", "Best Deals"];
const PAGE_SIZE = 8;

interface CategoryPageProps {
  hero: ReactNode;
  filters: string[];
  products: Product[];
  loading?: boolean;
  error?: string | null;
  /** Custom filter function — if omitted, falls back to category matching */
  filterFn?: (activeFilter: string, products: Product[]) => Product[];
  /** Optional strip rendered between grid and pagination */
  midBanner?: ReactNode;
}

function SkeletonCard() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="bg-[#F0F0F0] w-full" style={{ height: "320px" }} />
      <div className="flex flex-col gap-2 pt-3 px-1">
        <div className="h-3 bg-[#F0F0F0] rounded w-1/3" />
        <div className="h-4 bg-[#F0F0F0] rounded w-2/3" />
        <div className="h-4 bg-[#F0F0F0] rounded w-1/4" />
      </div>
    </div>
  );
}

function sortProducts(products: Product[], sortLabel: string): Product[] {
  const p = [...products];
  if (sortLabel === "Price: Low to High") return p.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
  if (sortLabel === "Price: High to Low") return p.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
  if (sortLabel === "Best Deals") return p.sort((a, b) => (b.discountPct ?? 0) - (a.discountPct ?? 0));
  return p; // Newest — already ordered by created_at DESC from DB
}

export default function CategoryPage({
  hero, filters, products, loading, error, filterFn, midBanner,
}: CategoryPageProps) {
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [sortLabel, setSortLabel] = useState("Newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [page, setPage] = useState(1);

  const defaultFilterFn = (active: string, prods: Product[]) =>
    active === filters[0]
      ? prods
      : prods.filter((p) => p.category.toLowerCase() === active.toLowerCase());

  const filtered = sortProducts(
    (filterFn ?? defaultFilterFn)(activeFilter, products),
    sortLabel
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageProducts = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleFilter(f: string) {
    setActiveFilter(f);
    setPage(1);
  }

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      {hero}

      {/* ── Filter / Sort bar ── */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-white border-b border-[#F0F0F0] px-4 py-4 md:px-[60px]">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 md:flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => handleFilter(f)}
              className="font-sans font-medium transition shrink-0"
              style={{
                fontSize: "12px",
                padding: "8px 18px",
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

        <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
          <span className="font-sans text-[#999999]" style={{ fontSize: "12px" }}>
            {loading ? "Loading..." : `${filtered.length} results`}
          </span>
          <div className="relative">
            <button
              className="flex items-center gap-2 font-sans text-[#666666] border border-[#E0D5D5] rounded"
              style={{ fontSize: "12px", padding: "8px 14px" }}
              onClick={() => setSortOpen((o) => !o)}
            >
              Sort: {sortLabel}
              <ChevronDown size={14} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-[#E0D5D5] shadow-md z-20 min-w-[180px]">
                {SORT_OPTIONS.map((o) => (
                  <button
                    key={o}
                    onClick={() => { setSortLabel(o); setSortOpen(false); }}
                    className="block w-full text-left px-4 py-3 font-sans text-[13px] text-[#555] hover:bg-[#FDF6F6] hover:text-bodyshop-blush transition"
                  >
                    {o}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Product grid ── */}
      <div className="flex flex-col gap-8 px-4 py-10 md:px-[60px] md:py-12">
        {error ? (
          <div className="py-20 text-center">
            <p className="font-sans text-[#AAAAAA]" style={{ fontSize: "14px" }}>
              Unable to load products. Please try again later.
            </p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : pageProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
            {pageProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="font-serif italic text-[#AAAAAA]" style={{ fontSize: "22px" }}>
              No products found in this category.
            </p>
          </div>
        )}
      </div>

      {/* ── Optional mid-banner ── */}
      {midBanner}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 px-4 py-8 md:px-[60px] md:py-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-9 h-9 flex items-center justify-center border border-[#E0D5D5] rounded text-[#666] disabled:opacity-40 hover:border-bodyshop-blush transition"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className="w-9 h-9 flex items-center justify-center rounded font-sans font-medium transition"
              style={{
                fontSize: "13px",
                background: page === n ? "#E8A0A0" : "transparent",
                color: page === n ? "#FFFFFF" : "#666666",
                border: page === n ? "none" : "1px solid #E0D5D5",
              }}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-9 h-9 flex items-center justify-center border border-[#E0D5D5] rounded text-[#666] disabled:opacity-40 hover:border-bodyshop-blush transition"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* ── Newsletter ── */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-6 bg-[#FDF6F6] px-4 py-10 md:px-[60px] md:py-10">
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
            className="h-[42px] px-5 bg-bodyshop-blush text-white font-sans font-semibold tracking-[0.15em] text-[11px] hover:bg-bodyshop-blush-dark transition shrink-0"
          >
            SUBSCRIBE
          </button>
        </form>
      </section>
    </div>
  );
}
