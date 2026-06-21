import { useCartStore } from "../stores/cart.store";
import { cartService } from "../services/cart.service";

export function useCart() {
    const { cart, totalPrice, setCart, setTotalPrice, clearCartState } = useCartStore();

    const fetchCart = async (page = 1, limit = 20) => {
        const data = await cartService.list(page, limit);
        setCart(data);
    };

    const fetchTotal = async () => {
        const total = await cartService.getTotal();
        setTotalPrice(total);
    };

    const addToCart = async (id: number, quantity = 1) => {
        await cartService.add(id, quantity);
        await fetchCart();
        await fetchTotal();
    };

    const removeFromCart = async (id: number, quantity = 1) => {
        await cartService.remove(id, quantity);
        await fetchCart();
        await fetchTotal();
    };

    const toggleItem = async (id: number, state?: boolean) => {
        await cartService.toggle(id, state);
        await fetchCart();
    };

    const clearCart = async () => {
        await cartService.clear();
        clearCartState();
    };

    return {
        cart,
        totalPrice,

        fetchCart,
        fetchTotal,

        addToCart,
        removeFromCart,
        toggleItem,
        clearCart,
    };
}