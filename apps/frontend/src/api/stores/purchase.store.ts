import { create } from "zustand";
import type { Paginated, Purchase } from "@unlockit/shared";

interface PurchaseState {
    purchases: Paginated<Purchase> | null;

    setPurchases: (
        data:
            | Paginated<Purchase>
            | ((prev: Paginated<Purchase> | null) => Paginated<Purchase> | null)
    ) => void;
}

export const usePurchaseStore = create<PurchaseState>((set) => ({
    purchases: null,

    setPurchases: (data) =>
        set((state) => ({
            purchases:
                typeof data === "function" ? data(state.purchases) : data,
        })),
}));