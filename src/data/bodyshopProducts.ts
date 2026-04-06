import { Product } from "@/components/bodyshop/ProductCard";

// Placeholder products — replace with Neon DB fetch when API is wired up
export const ALL_PRODUCTS: Product[] = [
  // ── Shoes ──────────────────────────────────────────────────────────────────
  {
    id: "s1", slug: "sienna-stiletto", name: "Sienna Stiletto",
    category: "Heels", price: 485, image:
      "https://images.unsplash.com/photo-1551232864-95a17264ad12?auto=format&fit=crop&w=600&q=80",
    badge: "NEW",
  },
  {
    id: "s2", slug: "rose-platform-heel", name: "Rosé Platform Heel",
    category: "Heels", price: 295, image:
      "https://images.unsplash.com/photo-1629242783674-ef9f65a2324c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "s3", slug: "monaco-mule", name: "Monaco Mule",
    category: "Flats", price: 390, image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "s4", slug: "amalfi-sandal", name: "Amalfi Sandal",
    category: "Sandals", price: 295, image:
      "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "s5", slug: "porto-pump", name: "Porto Pump",
    category: "Heels", price: 540, image:
      "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "s6", slug: "capri-platform", name: "Capri Platform",
    category: "Heels", price: 620, image:
      "https://images.unsplash.com/photo-1612150392084-a16e1ecb0eb3?auto=format&fit=crop&w=600&q=80",
    badge: "SALE", discountPct: 30, originalPrice: 620, salePrice: 434,
  },
  {
    id: "s7", slug: "riviera-loafer", name: "Riviera Loafer",
    category: "Flats", price: 360, image:
      "https://images.unsplash.com/photo-1465453869711-7e174808ace9?auto=format&fit=crop&w=600&q=80",
    badge: "SALE", discountPct: 20, originalPrice: 360, salePrice: 288,
  },
  {
    id: "s8", slug: "palermo-boot", name: "Palermo Boot",
    category: "Boots", price: 780, image:
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80",
  },

  // ── Handbags ───────────────────────────────────────────────────────────────
  {
    id: "h1", slug: "riviera-satchel", name: "Riviera Satchel",
    category: "Satchels", price: 720, image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80",
    badge: "NEW",
  },
  {
    id: "h2", slug: "milan-tote", name: "Milan Tote",
    category: "Totes", price: 850, image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "h3", slug: "capri-clutch", name: "Capri Clutch",
    category: "Clutches", price: 310, image:
      "https://images.unsplash.com/photo-1566150905458-1bf1460f4d11?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "h4", slug: "milano-crossbody", name: "Milano Crossbody",
    category: "Crossbody", price: 495, image:
      "https://images.unsplash.com/photo-1584891376083-4d6ffd5f11f3?auto=format&fit=crop&w=600&q=80",
    badge: "SALE", discountPct: 25, originalPrice: 495, salePrice: 371,
  },
  {
    id: "h5", slug: "portofino-tote", name: "Portofino Tote",
    category: "Totes", price: 680, image:
      "https://images.unsplash.com/photo-1605733513597-a8f8341084e6?auto=format&fit=crop&w=600&q=80",
    badge: "SALE", discountPct: 20, originalPrice: 680, salePrice: 544,
  },
  {
    id: "h6", slug: "venezia-clutch", name: "Venezia Clutch",
    category: "Clutches", price: 275, image:
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=600&q=80",
  },

  // ── Watches ────────────────────────────────────────────────────────────────
  {
    id: "w1", slug: "corsica-watch", name: "Corsica Watch",
    category: "Luxury", price: 1250, image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    badge: "NEW",
  },
  {
    id: "w2", slug: "aurelia-watch", name: "Aurelia Watch",
    category: "Luxury", price: 980, image:
      "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&w=600&q=80",
    badge: "SALE", discountPct: 15, originalPrice: 980, salePrice: 833,
  },
  {
    id: "w3", slug: "monaco-timepiece", name: "Monaco Timepiece",
    category: "Sport", price: 650, image:
      "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "w4", slug: "capri-classic", name: "Capri Classic",
    category: "Casual", price: 420, image:
      "https://images.unsplash.com/photo-1518131672697-613becd4fab5?auto=format&fit=crop&w=600&q=80",
  },

  // ── Accessories ────────────────────────────────────────────────────────────
  {
    id: "a1", slug: "venezia-scarf", name: "Venezia Scarf",
    category: "Scarves", price: 185, image:
      "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=600&q=80",
    badge: "SALE", discountPct: 35, originalPrice: 185, salePrice: 120,
  },
  {
    id: "a2", slug: "nova-bracelet", name: "Nova Bracelet",
    category: "Jewellery", price: 230, image:
      "https://images.unsplash.com/photo-1603974372054-5a05c8a31756?auto=format&fit=crop&w=600&q=80",
    badge: "SALE", discountPct: 20, originalPrice: 230, salePrice: 184,
  },
  {
    id: "a3", slug: "riviera-belt", name: "Riviera Belt",
    category: "Belts", price: 155, image:
      "https://images.unsplash.com/photo-1624560760434-da2b0d67fa34?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "a4", slug: "amalfi-sunglasses", name: "Amalfi Sunglasses",
    category: "Eyewear", price: 320, image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
    badge: "NEW",
  },
];

export const NEW_ARRIVALS = ALL_PRODUCTS.filter((p) => p.badge === "NEW");
export const SALE_PRODUCTS = ALL_PRODUCTS.filter((p) => p.badge === "SALE");
export const SHOES = ALL_PRODUCTS.filter((p) =>
  ["Heels", "Flats", "Boots", "Sandals", "Sneakers"].includes(p.category)
);
export const HANDBAGS = ALL_PRODUCTS.filter((p) =>
  ["Totes", "Clutches", "Crossbody", "Satchels"].includes(p.category)
);
export const WATCHES = ALL_PRODUCTS.filter((p) =>
  ["Luxury", "Sport", "Casual"].includes(p.category)
);
export const ACCESSORIES = ALL_PRODUCTS.filter((p) =>
  ["Scarves", "Belts", "Jewellery", "Eyewear"].includes(p.category)
);
