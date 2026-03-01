"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { orderService } from "@/services/order.service";

export default function CheckoutPage() {
    const router = useRouter();
    const { token, isAuthenticated } = useAuth();
    const { items, subtotal, clearCart } = useCart();
    const [shippingAddress, setShippingAddress] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    if (!isAuthenticated) {
        return <p className="text-sm text-slate-600">Please login first to checkout.</p>;
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token) return;

        setIsLoading(true);
        setMessage(null);
        try {
            await orderService.create({ shippingAddress }, token);
            await clearCart();
            setMessage("Order placed successfully.");
            setTimeout(() => router.push("/orders"), 1000);
        } catch (err) {
            setMessage(err instanceof Error ? err.message : "Checkout failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h1 className="text-xl font-bold text-slate-900">Checkout</h1>
                <p className="mt-1 text-sm text-slate-600">Confirm shipping details and place order.</p>

                <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                    <Input
                        label="Shipping address"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        required
                    />

                    <Button type="submit" className="w-full" isLoading={isLoading} disabled={items.length === 0}>
                        Place order
                    </Button>

                    {message ? <p className="text-sm text-slate-600">{message}</p> : null}
                </form>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    {items.map((item) => (
                        <li key={item.id} className="flex justify-between">
                            <span>
                                {item.product.name} × {item.quantity}
                            </span>
                            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
                <div className="mt-6 border-t border-slate-200 pt-4">
                    <p className="flex justify-between text-base font-semibold text-slate-900">
                        <span>Total</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </p>
                </div>
            </div>
        </section>
    );
}
