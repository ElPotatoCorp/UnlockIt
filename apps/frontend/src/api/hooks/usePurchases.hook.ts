import { usePurchaseStore } from "../stores/purchase.store";
import { purchaseService } from "../services/purchase.service";

export function usePurchases() {
    const { purchases, setPurchases } = usePurchaseStore();

    const fetchPurchases = async (page = 1, limit = 20) => {
        const data = await purchaseService.list(page, limit);
        setPurchases(data);
    };

    const fetchPurchase = async (orderId: string, gameId: number) => {
        return await purchaseService.getOne(orderId, gameId);
    };

    const fetchKeys = async (orderId: string, gameId: number) => {
        return await purchaseService.getKeys(orderId, gameId);
    };

    const createReview = async (orderId: string, gameId: number, review: { content: string; rate: number }) => {
        await purchaseService.createReview(orderId, gameId, review);
        await fetchPurchases();
    };

    const updateReview = async (orderId: string, gameId: number, review: { content: string; rate: number }) => {
        await purchaseService.updateReview(orderId, gameId, review);
        await fetchPurchases();
    };

    const deleteReview = async (orderId: string, gameId: number) => {
        await purchaseService.deleteReview(orderId, gameId);
        await fetchPurchases();
    };

    return {
        purchases,

        fetchPurchases,
        fetchPurchase,
        fetchKeys,

        createReview,
        updateReview,
        deleteReview,
    };
}