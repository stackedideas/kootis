import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  originalPrice?: number;
  image: string;
  badge?: "NEW" | "SALE";
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem) => void;
  isWishlisted: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem(item) {
        set((state) => ({
          items: state.items.some((i) => i.id === item.id)
            ? state.items
            : [...state.items, item],
        }));
      },

      removeItem(id) {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
      },

      toggleItem(item) {
        if (get().isWishlisted(item.id)) {
          get().removeItem(item.id);
        } else {
          get().addItem(item);
        }
      },

      isWishlisted(id) {
        return get().items.some((i) => i.id === id);
      },

      clearWishlist() {
        set({ items: [] });
      },
    }),
    { name: "kootis-wishlist" }
  )
);
