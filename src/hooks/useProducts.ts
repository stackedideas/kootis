import { useState, useEffect } from "react";
import { Product } from "@/components/bodyshop/ProductCard";

interface UseProductsOptions {
  category?: string;
  badge?: string;
  featured?: boolean;
  slug?: string;
}

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
}

// Map DB row → Product shape used by components
function mapRow(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    category: row.category as string,
    price: Number(row.price),
    salePrice: row.sale_price != null ? Number(row.sale_price) : undefined,
    originalPrice: row.original_price != null ? Number(row.original_price) : undefined,
    image: row.image as string,
    badge: row.badge as Product["badge"],
    discountPct: row.discount_pct != null ? Number(row.discount_pct) : undefined,
  };
}

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (options.category) params.set("category", options.category);
    if (options.badge) params.set("badge", options.badge);
    if (options.featured) params.set("featured", "true");
    if (options.slug) params.set("slug", options.slug);

    fetch(`/api/products?${params.toString()}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch products");
        return r.json();
      })
      .then((rows) => setProducts(rows.map(mapRow)))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.category, options.badge, options.featured, options.slug]);

  return { products, loading, error };
}

// Fetch a single product by slug
export function useProduct(slug: string): { product: Product | null; loading: boolean; error: string | null } {
  const { products, loading, error } = useProducts({ slug });
  return { product: products[0] ?? null, loading, error };
}
