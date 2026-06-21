import { useState } from "react";
import { ordersService } from "../services/orders.service";
import type { Order, OrderSummary, Paginated } from "@unlockit/shared";

export function useOrders() {
    const [orders, setOrders] = useState<Paginated<OrderSummary> | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);

    const loadOrders = async (page = 1, limit = 20) => {
        setLoading(true);
        try {
            const data = await ordersService.getOrders(page, limit);
            setOrders(data);
        } finally {
            setLoading(false);
        }
    };

    const loadOrder = async (id: string) => {
        setLoading(true);
        try {
            const data = await ordersService.getOrder(id);
            setSelectedOrder(data);
        } finally {
            setLoading(false);
        }
    };

    return {
        orders,
        selectedOrder,
        loading,
        loadOrders,
        loadOrder,
    };
}