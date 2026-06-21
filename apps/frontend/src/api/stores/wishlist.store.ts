import { create } from "zustand";
import type { Wishlist, Paginated } from "@unlockit/shared";

interface WishlistState {
    wishlist: Paginated<Wishlist> | null;
    isInWishlist: boolean | null;

    setWishlist: (
        data:
            | Paginated<Wishlist>
            | ((
                prev: Paginated<Wishlist> | null
            ) => Paginated<Wishlist> | null)
    ) => void;

    setIsInWishlist: (value: boolean) => void;
    clearIsInWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set) => ({
    wishlist: null,
    isInWishlist: null,

    setWishlist: (data) =>
        set((state) => ({
            wishlist:
                typeof data === "function"
                    ? data(state.wishlist)
                    : data,
        })),

    setIsInWishlist: (value) => set({ isInWishlist: value }),
    clearIsInWishlist: () => set({ isInWishlist: null }),
}));