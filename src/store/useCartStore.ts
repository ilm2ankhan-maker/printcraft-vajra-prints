import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "@/store/useAuthStore";

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
    canvasData?: unknown;
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

/** Returns the active userId bucket key: the logged-in user's userId, or "guest". */
function getActiveUserId(): string {
  const user = useAuthStore.getState().currentUser;
  return user?.userId || "guest";
}

interface CartStore {
  /** All carts keyed by userId (or "guest"). */
  cartsByUser: Record<string, CartItem[]>;

  /** Computed active items for the current user. */
  items: CartItem[];

  /** Sync `items` from `cartsByUser` for the given user key (call on login/logout). */
  syncToUser: (userId: string) => void;

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
      cartsByUser: {},
      items: [],

      syncToUser: (userId: string) => {
        const bucket = get().cartsByUser[userId] ?? [];
        set({ items: bucket });
      },

      addItem: (newItem) => {
        const uid = getActiveUserId();
        set((state) => {
          const id = `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          const bucket = [...(state.cartsByUser[uid] ?? []), { ...newItem, id }];
          return {
            cartsByUser: { ...state.cartsByUser, [uid]: bucket },
            items: bucket,
          };
        });
      },

      removeItem: (id) => {
        const uid = getActiveUserId();
        set((state) => {
          const bucket = (state.cartsByUser[uid] ?? []).filter((item) => item.id !== id);
          return {
            cartsByUser: { ...state.cartsByUser, [uid]: bucket },
            items: bucket,
          };
        });
      },

      updateQuantity: (id, quantity) => {
        const uid = getActiveUserId();
        set((state) => {
          const bucket = (state.cartsByUser[uid] ?? []).map((item) => {
            if (item.id === id) {
              const newQty = Math.max(1, quantity);
              return { ...item, quantity: newQty, totalPrice: Math.round(item.unitPrice * newQty * 100) / 100 };
            }
            return item;
          });
          return {
            cartsByUser: { ...state.cartsByUser, [uid]: bucket },
            items: bucket,
          };
        });
      },

      clearCart: () => {
        const uid = getActiveUserId();
        set((state) => ({
          cartsByUser: { ...state.cartsByUser, [uid]: [] },
          items: [],
        }));
      },

      getSubtotal: () => get().items.reduce((sum, item) => sum + item.totalPrice, 0),

      getTax: () => Math.round(get().getSubtotal() * 0.18),

      getShipping: () => {
        const sub = get().getSubtotal();
        if (sub === 0) return 0;
        return sub >= 2000 ? 0 : 120;
      },

      getTotal: () => get().getSubtotal() + get().getTax() + get().getShipping(),
    }),
    {
      name: "printcraft-cart-storage",
      // On rehydration, restore items for the active user
      onRehydrateStorage: () => (state) => {
        if (state) {
          const uid = useAuthStore.getState().currentUser?.userId || "guest";
          state.items = state.cartsByUser[uid] ?? [];
        }
      },
    }
  )
);
