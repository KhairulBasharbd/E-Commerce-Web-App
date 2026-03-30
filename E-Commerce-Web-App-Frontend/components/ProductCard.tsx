'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Star, Package, Eye } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { cartApi } from '@/lib/api';
import { toast } from '@/components/Toast';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/Spinner';

interface ProductCardProps {
    product: Product;
}

// Category colors
const categoryColors: Record<string, string> = {
    ELECTRONICS: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    FASHION: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    HOME_LIVING: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    ACCESSORIES: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    DEFAULT: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
};

function getCategoryColor(category: string) {
    return categoryColors[category] ?? categoryColors.DEFAULT;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [loading, setLoading] = useState(false);
    const { refreshCart } = useCart();
    const { isAuthenticated, isAdmin } = useAuth();

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            toast.error('Please login to add items to cart');
            return;
        }
        setLoading(true);
        try {
            await cartApi.addItem({ productId: product.id, quantity: 1 });
            await refreshCart();
            toast.success(`${product.name} added to cart!`);
        } catch {
            toast.error('Failed to add item to cart');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="group relative flex flex-col rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-md overflow-hidden hover:border-violet-500/40 hover:bg-slate-900/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(139,92,246,0.15)]">
            {/* Image Section */}
            <Link href={`/products/${product.id}`} className="relative h-56 bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center overflow-hidden">
                <Package className="h-20 w-20 text-slate-700 group-hover:text-violet-500/40 group-hover:scale-110 transition-all duration-700" />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-violet-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Visual indicator for "View Details" */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full flex items-center gap-2 text-white text-xs font-bold shadow-2xl">
                        <Eye className="h-4 w-4" />
                        View Details
                    </div>
                </div>

                {!product.active && (
                    <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center backdrop-blur-sm z-10">
                        <span className="text-xs font-black uppercase tracking-widest text-red-400 bg-red-400/10 px-4 py-2 rounded-full border border-red-400/30">
                            Sold Out
                        </span>
                    </div>
                )}
                
                {product.stockQuantity <= 5 && product.active && (
                    <span className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-tighter text-orange-400 bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/20 backdrop-blur-md">
                        Low Stock: {product.stockQuantity}
                    </span>
                )}
            </Link>

            {/* Content Section */}
            <div className="flex flex-col flex-1 p-6 gap-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${getCategoryColor(product.category)}`}>
                            {product.category}
                        </span>
                        <div className="flex items-center gap-1 text-amber-400 font-bold text-xs ring-1 ring-white/5 py-1 px-2 rounded-lg bg-white/5">
                            <Star className="h-3 w-3 fill-amber-400" />
                            4.8
                        </div>
                    </div>
                    <Link
                        href={`/products/${product.id}`}
                        className="block font-bold text-white text-lg leading-tight hover:text-violet-400 transition-colors line-clamp-1"
                    >
                        {product.name}
                    </Link>
                </div>

                <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed h-10">
                    {product.description || 'Premium meticulously crafted item for your curated lifestyle collections.'}
                </p>

                <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500 font-medium uppercase tracking-widest leading-none mb-1">Price</span>
                        <span className="text-2xl font-black text-white">
                            {formatPrice(product.price)}
                        </span>
                    </div>
                    
                    {!isAdmin && (
                        <button
                            onClick={handleAddToCart}
                            disabled={loading || !product.active}
                            className="flex items-center justify-center p-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg hover:shadow-violet-500/35 transition-all active:scale-95 group/btn"
                        >
                            {loading ? (
                                <Spinner size="sm" />
                            ) : (
                                <ShoppingCart className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
