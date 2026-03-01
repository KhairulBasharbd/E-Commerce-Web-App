'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ordersApi, paymentsApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/components/Toast';
import { Spinner } from '@/components/Spinner';
import { CreditCard, ShieldCheck, ShoppingBag, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
    const { cart, itemCount, clearCart } = useCart();
    const [step, setStep] = useState<'review' | 'success'>('review');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            // 1. Place Order
            const order = await ordersApi.place();
            toast.info('Order created, processing payment...');

            // 2. Mock Payment
            await paymentsApi.pay(order.id);

            toast.success('Order completed successfully!');
            clearCart();
            setStep('success');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const total = cart?.items.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;

    if (step === 'success') {
        return (
            <div className="container mx-auto px-4 py-20 text-center animate-fade-in">
                <div className="glass-card max-w-xl mx-auto p-12 space-y-8">
                    <div className="h-24 w-24 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mx-auto border border-emerald-500/20">
                        <CheckCircle2 className="h-12 w-12" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black text-white leading-tight">Order Confirmed!</h1>
                        <p className="text-lg text-slate-400">
                            Your payment was successful and your luxury collection is now being prepared for shipping.
                            You'll receive an email confirmation shortly.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link href="/" className="btn-primary flex-1">
                            Back to Home
                        </Link>
                        <Link href="/products" className="btn-secondary flex-1">
                            Browse More
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!cart || itemCount === 0) {
        router.push('/cart');
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-12 animate-fade-in">
            <Link href="/cart" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-10 transition-colors group">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Return to Cart
            </Link>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Left Side: Summary and Billing Informative */}
                <div className="flex-1 space-y-8">
                    <div className="glass-card p-8 space-y-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <ShoppingBag className="h-6 w-6 text-violet-400" />
                            Order Summary
                        </h2>
                        <div className="divide-y divide-white/5">
                            {cart.items.map((item) => (
                                <div key={item.productId} className="py-4 flex justify-between items-center">
                                    <div className="space-y-1">
                                        <p className="font-bold text-white">{item.name}</p>
                                        <p className="text-xs text-slate-500 uppercase tracking-widest font-black">Quantity: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-slate-300">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                            <span className="text-slate-400 font-medium">Total Amount</span>
                            <span className="text-3xl font-black text-white">{formatPrice(total)}</span>
                        </div>
                    </div>

                    <div className="glass-card p-8 space-y-6 opacity-60">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <ShieldCheck className="h-6 w-6 text-emerald-400" />
                            Secure Billing (Mock)
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
                                <p className="text-[10px] uppercase font-bold text-slate-500">Shipping Address</p>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    123 Luxury Avenue, Penthouse Level<br />
                                    Metropolis, NY 10001
                                </p>
                            </div>
                            <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
                                <p className="text-[10px] uppercase font-bold text-slate-500">Payment Method</p>
                                <p className="text-sm text-slate-300 flex items-center gap-2">
                                    <CreditCard className="h-4 w-4" />
                                    •••• •••• •••• 4242 (Mock)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Payment Action */}
                <div className="lg:w-96">
                    <div className="glass-card p-8 sticky top-24 space-y-8 bg-gradient-to-b from-white/10 to-transparent">
                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-white uppercase tracking-wider">Final Step</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                By clicking "Purchase Now", you agree to our mock terms of service. Since this is an MVP,
                                no real payment will be processed.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="btn-primary w-full h-16 text-xl gap-3 shadow-violet-500/30"
                            >
                                {loading ? <Spinner className="text-white" /> : <CreditCard className="h-6 w-6" />}
                                {loading ? 'Processing...' : 'Purchase Now'}
                            </button>

                            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 animate-pulse">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                Secure server connection active
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/10 space-y-4">
                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                                <span>SSL Encryption Enabled</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                                <span>30-Day Money Back Guarantee</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
