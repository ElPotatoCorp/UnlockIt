import { create } from "zustand";
import type { CartItem, Paginated } from "@unlockit/shared";

interface CartState {
    cart: Paginated<CartItem> | null;
    totalPrice: number;

    setCart: (cart: Paginated<CartItem>) => void;
    setTotalPrice: (total: number) => void;
    clearCartState: () => void;
}

export const useCartStore = create<CartState>((set) => ({
    cart: null,
    totalPrice: 0,

    setCart: (cart) => set({ cart }),
    setTotalPrice: (total) => set({ totalPrice: total }),
    clearCartState: () => set({ cart: null, totalPrice: 0 }),
}));