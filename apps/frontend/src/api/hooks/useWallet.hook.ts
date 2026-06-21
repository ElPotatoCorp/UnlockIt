import { walletService } from "../services/wallet.service";
import { useWalletStore } from "../stores/wallet.store";

export function useWallet() {
    const { balance, transactions, setBalance, setTransactions } = useWalletStore();

    const loadBalance = async () => {
        const data = await walletService.getBalance();
        setBalance(data);
    };

    const loadTransactions = async (page = 1, limit = 20) => {
        const data = await walletService.getTransactions(page, limit);
        setTransactions(data);
    };

    const topUp = async (amount: number) => {
        const data = await walletService.topUp(amount);
        setBalance(data);
    };

    return {
        balance,
        transactions,
        loadBalance,
        loadTransactions,
        topUp,
    };
}