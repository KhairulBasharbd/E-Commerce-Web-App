'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Star, Package } from 'lucide-react';
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
    ELECTRONICS: 'bg-blue-500/20 text-blue-300',
    CLOTHING: 'bg-pink-500/20 text-pink-300',
    FOOD: 'bg-orange-500/20 text-orange-300',
    BOOKS: 'bg-amber-500/20 text-amber-300',
    SPORTS: 'bg-green-500/20 text-green-300',
    DEFAULT: 'bg-violet-500/20 text-violet-300',
};

function getCategoryColor(category: string) {
    return categoryColors[category] ?? categoryColors.DEFAULT;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [loading, setLoading] = useState(false);
    const { refreshCart } = useCart();
    const { isAuthenticated, isAdmin } = useAuth();

    const handleAddToCart = async () => {
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
        <div className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden hover:border-violet-500/40 hover:bg-white/8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10">
            {/* Product Image Placeholder */}
            <Link href={`/products/${product.id}`} className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
                <Package className="h-16 w-16 text-slate-600 group-hover:text-slate-500 transition-colors" />
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {!product.active && (
                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-sm font-semibold text-red-400 bg-red-400/10 px-3 py-1 rounded-full border border-red-400/30">
                            Out of Stock
                        </span>
                    </div>
                )}
                {product.stockQuantity <= 5 && product.active && (
                    <span className="absolute top-3 right-3 text-xs font-semibold text-orange-300 bg-orange-500/20 px-2 py-1 rounded-full border border-orange-500/30">
                        Only {product.stockQuantity} left
                    </span>
                )}
            </Link>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4 gap-2">
                <div className="flex items-start justify-between gap-2">
                    <Link
                        href={`/products/${product.id}`}
                        className="font-semibold text-white text-sm leading-tight hover:text-violet-300 transition-colors line-clamp-2"
                    >
                        {product.name}
                    </Link>
                    <span className={`shrink-0 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${getCategoryColor(product.category)}`}>
                        {product.category}
                    </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 flex-1">
                    {product.description || 'No description available.'}
                </p>

                <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-white">
                        {formatPrice(product.price)}
                    </span>
                    {!isAdmin && (
                        <button
                            onClick={handleAddToCart}
                            disabled={loading || !product.active}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-violet-500/25 transition-all"
                        >
                            {loading ? (
                                <Spinner size="sm" />
                            ) : (
                                <ShoppingCart className="h-3.5 w-3.5" />
                            )}
                            Add to Cart
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
