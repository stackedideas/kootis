import ProductCard, { Product } from "./ProductCard";

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

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  columns?: 2 | 4;
}

export default function ProductGrid({ products, loading, error, columns = 4 }: ProductGridProps) {
  const gridClass = columns === 4
    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 md:gap-6"
    : "grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6";

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="font-sans text-[#AAAAAA]" style={{ fontSize: "14px" }}>
          Unable to load products. Please try again later.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: columns === 4 ? 8 : 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="font-serif italic text-[#AAAAAA]" style={{ fontSize: "22px" }}>
          No products found in this category.
        </p>
      </div>
    );
  }

  return (
    <div className={gridClass}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
