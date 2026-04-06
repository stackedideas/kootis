import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;    // actual price paid (sale price if discounted)
  originalPrice?: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string, size?: string, color?: string) => void;
  updateQuantity: (id: string, size: string | undefined, color: string | undefined, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

function itemKey(id: string, size?: string, color?: string) {
  return `${id}::${size ?? ""}::${color ?? ""}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem(item) {
        const key = itemKey(item.id, item.size, item.color);
        set((state) => {
          const existing = state.items.find(
            (i) => itemKey(i.id, i.size, i.color) === key
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i.id, i.size, i.color) === key
                  ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { ...item, quantity: item.quantity ?? 1 }],
          };
        });
      },

      removeItem(id, size, color) {
        const key = itemKey(id, size, color);
        set((state) => ({
          items: state.items.filter((i) => itemKey(i.id, i.size, i.color) !== key),
        }));
      },

      updateQuantity(id, size, color, quantity) {
        const key = itemKey(id, size, color);
        if (quantity <= 0) {
          get().removeItem(id, size, color);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            itemKey(i.id, i.size, i.color) === key ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart() {
        set({ items: [] });
      },

      totalItems() {
        return get().items.reduce((acc, i) => acc + i.quantity, 0);
      },

      subtotal() {
        return get().items.reduce((acc, i) => acc + i.price * i.quantity, 0);
      },
    }),
    { name: "kootis-cart" }
  )
);
