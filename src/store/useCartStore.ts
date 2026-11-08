import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedOptions: Record<string, string>;
  designSnapshot?: {
    previewUrl?: string;
    canvasData?: any;
    widthMm: number;
    heightMm: number;
    title?: string;
  };
  laserSpecs?: {
    cutLengthMm: number;
    areaCm2: number;
    material: string;
    thicknessMm?: number;
  };
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTax: () => number;
  getShipping: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          const id = `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          return {
            items: [...state.items, { ...newItem, id }],
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === id) {
              const newQty = Math.max(1, quantity);
              return {
                ...item,
                quantity: newQty,
                totalPrice: Math.round(item.unitPrice * newQty * 100) / 100,
              };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.totalPrice, 0);
      },

      getTax: () => {
        const subtotal = get().getSubtotal();
        return Math.round(subtotal * 0.18); // 18% GST
      },

      getShipping: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= 2000 ? 0 : 120; // Free over ₹2,000
      },

      getTotal: () => {
        return get().getSubtotal() + get().getTax() + get().getShipping();
      },
    }),
    {
      name: "ivory-ink-cart-storage",
    }
  )
);

