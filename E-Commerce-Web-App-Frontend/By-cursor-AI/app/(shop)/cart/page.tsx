'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { cartApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/components/Toast';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Spinner, PageLoader } from '@/components/Spinner';

export default function CartPage() {
    const { cart, itemCount, refreshCart } = useCart();
    const [updating, setUpdating] = useState<string | null>(null);

    const handleUpdateQty = async (productId: string, currentQty: number, delta: number) => {
        const newQty = currentQty + delta;
        if (newQty < 1) return;

        setUpdating(productId);
        try {
            await cartApi.updateItem({ productId, quantity: newQty });
            await refreshCart();
        } catch {
            toast.error('Failed to update quantity');
        } finally {
            setUpdating(null);
        }
    };

    const handleRemove = async (productId: string) => {
        setUpdating(productId);
        try {
            await cartApi.removeItem(productId);
            await refreshCart();
            toast.success('Removed from cart');
        } catch {
            toast.error('Failed to remove item');
        } finally {
            setUpdating(null);
        }
    };

    const total = cart?.items.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;

    if (!cart && itemCount === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center animate-fade-in">
                <div className="glass-card max-w-lg mx-auto p-12 space-y-6">
                    <div className="h-20 w-20 bg-violet-500/10 rounded-full flex items-center justify-center text-violet-400 mx-auto border border-violet-500/20">
                        <ShoppingBag className="h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white">Your cart is empty</h2>
                        <p className="text-slate-400">Looks like you haven't added anything to your collection yet.</p>
                    </div>
                    <Link href="/products" className="btn-primary block">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-white mb-10">Shopping Cart</h1>

            <div className="flex flex-col xl:flex-row gap-8">
                {/* Items List */}
                <div className="flex-1 space-y-4">
                    {cart?.items.map((item) => (
                        <div key={item.productId} className="glass-card p-4 flex flex-col sm:flex-row items-center gap-6 group">
                            {/* Product Placeholder */}
                            <div className="h-24 w-24 bg-white/5 rounded-xl shrink-0 flex items-center justify-center border border-white/5 transition-colors group-hover:border-violet-500/20">
                                <ShoppingBag className="h-8 w-8 text-slate-600" />
                            </div>

                            {/* Details */}
                            <div className="flex-1 text-center sm:text-left">
                                <Link href={`/products/${item.productId}`} className="font-bold text-white hover:text-violet-400 transition-colors">
                                    {item.name}
                                </Link>
                                <p className="text-sm text-slate-500 mt-1">{formatPrice(item.price)} per unit</p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3 bg-white/5 rounded-xl border border-white/10 p-1">
                                    <button
                                        onClick={() => handleUpdateQty(item.productId, item.quantity, -1)}
                                        disabled={updating === item.productId || item.quantity <= 1}
                                        className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-20 translate-y-[1px]"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="text-sm font-bold text-white w-4 text-center">
                                        {updating === item.productId ? <Spinner size="sm" /> : item.quantity}
                                    </span>
                                    <button
                                        onClick={() => handleUpdateQty(item.productId, item.quantity, 1)}
                                        disabled={updating === item.productId}
                                        className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-20 translate-y-[1px]"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="text-right min-w-[100px]">
                                    <p className="font-bold text-white">{formatPrice(item.price * item.quantity)}</p>
                                </div>

                                <button
                                    onClick={() => handleRemove(item.productId)}
                                    disabled={updating === item.productId}
                                    className="h-10 w-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="xl:w-96">
                    <div className="glass-card p-8 sticky top-24 space-y-6">
                        <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4">Order Summary</h3>

                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between text-slate-400">
                                <span>Subtotal ({itemCount} items)</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Shipping</span>
                                <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-wide mt-0.5">Free</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-white pt-4 border-t border-white/10">
                                <span>Total</span>
                                <span className="text-violet-400">{formatPrice(total)}</span>
                            </div>
                        </div>

                        <Link href="/checkout" className="btn-primary w-full h-14 gap-2">
                            Proceed to Checkout
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
