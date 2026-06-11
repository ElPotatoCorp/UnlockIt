import { useWishlistStore } from "../stores/wishlist.store";
import { wishlistService } from "../services/wishlist.service";

export function useWishlist() {
    const {
        wishlist,
        isInWishlist,
        setWishlist,
        setIsInWishlist,
        clearIsInWishlist,
    } = useWishlistStore();

    const fetchWishlist = async (page = 1, limit = 20) => {
        const data = await wishlistService.list(page, limit);
        setWishlist(data);
    };

    const checkWishlist = async (gameId: number) => {
        const value = await wishlistService.isInWishlist(gameId);
        setIsInWishlist(value);
    };

    const addToWishlist = async (gameId: number) => {
        await wishlistService.add(gameId);
        setIsInWishlist(true);
    };

    const removeFromWishlist = async (gameId: number) => {
        await wishlistService.remove(gameId);
        setIsInWishlist(false);
    };

    return {
        wishlist,
        isInWishlist,

        fetchWishlist,
        checkWishlist,
        addToWishlist,
        removeFromWishlist,

        clearIsInWishlist,
    };
}