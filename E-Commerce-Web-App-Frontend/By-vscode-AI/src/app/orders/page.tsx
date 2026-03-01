"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { orderService } from "@/services/order.service";
import type { Order } from "@/types/api";

export default function OrdersPage() {
    const { token, isAuthenticated } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadOrders = async () => {
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const data = await orderService.getMine(token);
                setOrders(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load orders.");
            } finally {
                setIsLoading(false);
            }
        };

        void loadOrders();
    }, [token]);

    if (!isAuthenticated) {
        return <p className="text-sm text-slate-600">Please login to view your orders.</p>;
    }

    if (isLoading) {
        return <div className="h-32 animate-pulse rounded-lg bg-slate-200" />;
    }

    if (error) {
        return <p className="text-sm text-red-600">{error}</p>;
    }

    return (
        <section className="space-y-4">
            <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
            {orders.length === 0 ? (
                <p className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-600">
                    No orders yet.
                </p>
            ) : (
                orders.map((order) => (
                    <article key={order.id} className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h2 className="text-sm font-semibold text-slate-900">Order #{order.id}</h2>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                {order.status}
                            </span>
                        </div>
                        <p className="mt-2 text-xs text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                        <p className="mt-1 text-sm font-medium text-slate-900">Total: ${order.totalAmount.toFixed(2)}</p>
                    </article>
                ))
            )}
        </section>
    );
}
