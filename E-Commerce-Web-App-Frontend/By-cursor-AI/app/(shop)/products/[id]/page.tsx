'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { productsApi, cartApi } from '@/lib/api';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/components/Toast';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { PageLoader, Spinner } from '@/components/Spinner';
import { ShoppingCart, ArrowLeft, Package, Clock, ShieldCheck, Undo2 } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const { refreshCart } = useCart();
    const { isAuthenticated, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productsApi.getById(id as string);
                setProduct(data);
            } catch (error) {
                console.error('Product fetch error:', error);
                toast.error('Unable to load product detail. Check your connection.');
                router.push('/products');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, router]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to add items to cart');
            router.push(`/login?from=/products/${id}`);
            return;
        }
        setAdding(true);
        try {
            await cartApi.addItem({ productId: product!.id, quantity: 1 });
            await refreshCart();
            toast.success('Added to cart');
        } catch {
            toast.error('Failed to add item');
        } finally {
            setAdding(false);
        }
    };

    if (loading) return <PageLoader />;
    if (!product) return null;

    return (
        <div className="container mx-auto px-4 py-12 animate-fade-in">
            <Link href="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Gallery
            </Link>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Gallery Placeholder */}
                <div className="flex-1">
                    <div className="glass-card aspect-square flex items-center justify-center relative overflow-hidden group">
                        <Package className="h-32 w-32 text-slate-700 group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent pointer-events-none" />
                        {!product.active && (
                            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center">
                                <span className="text-xl font-black text-red-400 bg-red-400/10 px-8 py-3 rounded-full border border-red-400/30 rotate-[-5deg]">
                                    NOT ACTIVE
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-8">
                    <div className="space-y-4">
                        <span className="text-xs uppercase font-black text-violet-400 tracking-widest bg-violet-400/5 px-3 py-1.5 rounded-lg border border-violet-400/20">
                            {product.category}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                            {product.name}
                        </h1>
                        <p className="text-3xl font-bold text-violet-300">
                            {formatPrice(product.price)}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white">Description</h3>
                        <p className="text-slate-400 leading-relaxed text-lg">
                            {product.description || 'Elevate your aesthetic with this premium selection. Crafted with attention to detail and designed to stand out, this item represents the pinnacle of modern design and quality.'}
                        </p>
                    </div>

                    <div className="p-6 glass-card space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Availability</span>
                            {product.active && product.stockQuantity > 0 ? (
                                <span className="text-emerald-400 font-bold flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                    In Stock ({product.stockQuantity})
                                </span>
                            ) : (
                                <span className="text-red-400 font-bold">Sold Out</span>
                            )}
                        </div>

                        {!isAdmin && (
                            <button
                                onClick={handleAddToCart}
                                disabled={adding || !product.active || product.stockQuantity <= 0}
                                className="btn-primary w-full h-14 text-lg gap-3"
                            >
                                {adding ? <Spinner className="text-white" /> : <ShoppingCart className="h-6 w-6" />}
                                {adding ? 'Adding...' : 'Add to Collection'}
                            </button>
                        )}
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-4">
                        <Badge title="Fast Shipping" Icon={Clock} />
                        <Badge title="Verified Product" Icon={ShieldCheck} />
                        <Badge title="30-Day Return" Icon={Undo2} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Badge({ title, Icon }: { title: string; Icon: any }) {
    return (
        <div className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl bg-white/5 border border-white/5 text-center">
            <Icon className="h-5 w-5 text-slate-500" />
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider leading-tight">{title}</span>
        </div>
    );
}
