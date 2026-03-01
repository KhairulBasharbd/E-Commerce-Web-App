"use client";

import Link from "next/link";
import { CartItemRow } from "@/components/cart/cart-item-row";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";

export default function CartPage() {
    const { isAuthenticated } = useAuth();
    const { items, subtotal, clearCart, isLoading } = useCart();

    if (!isAuthenticated) {
        return (
            <section className="rounded-xl border border-slate-200 bg-white p-6 text-center">
                <h1 className="text-xl font-bold text-slate-900">Your cart</h1>
                <p className="mt-2 text-sm text-slate-600">Please login to view and manage your cart.</p>
                <Link
                    href="/login"
                    className="mt-4 inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                >
                    Login
                </Link>
            </section>
        );
    }

    return (
        <section className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Shopping Cart</h1>

            {isLoading ? (
                <div className="h-40 animate-pulse rounded-xl bg-slate-200" />
            ) : items.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
                    <p className="text-sm text-slate-600">Your cart is empty.</p>
                    <Link href="/" className="mt-3 inline-block text-sm font-medium text-slate-900 underline">
                        Continue shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {items.map((item) => (
                        <CartItemRow key={item.id} item={item} />
                    ))}

                    <div className="flex flex-col items-end gap-2 rounded-xl border border-slate-200 bg-white p-4">
                        <p className="text-sm text-slate-600">Subtotal</p>
                        <p className="text-2xl font-bold text-slate-900">${subtotal.toFixed(2)}</p>
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => void clearCart()}>
                                Clear cart
                            </Button>
                            <Link
                                href="/checkout"
                                className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                            >
                                Checkout
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
