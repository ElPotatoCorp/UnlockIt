import { create } from "zustand";
import type { WalletBalance, Paginated, WalletTransaction } from "@unlockit/shared";

interface WalletState {
    balance: WalletBalance | null;
    transactions: Paginated<WalletTransaction> | null;

    setBalance: (b: WalletBalance) => void;
    setTransactions: (t: Paginated<WalletTransaction>) => void;

    clearWallet: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
    balance: null,
    transactions: null,

    setBalance: (b) => set({ balance: b }),
    setTransactions: (t) => set({ transactions: t }),

    clearWallet: () => set({ balance: null, transactions: null }),
}));