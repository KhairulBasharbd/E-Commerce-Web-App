'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, Truck, ShieldCheck, Zap } from 'lucide-react';
import { productsApi } from '@/lib/api';
import type { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { ProductSkeleton } from '@/components/Spinner';

import { toast } from '@/components/Toast';

export default function HomePage() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setError(null);
            try {
                const data = await productsApi.list({ size: 4 });
                setFeaturedProducts(data.content);
            } catch (err: any) {
                const msg = 'Unable to connect to service. Please ensure backend is running.';
                setError(msg);
                toast.error(msg);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="space-y-20 pb-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-32">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-violet-600/10 rounded-full blur-[120px] -z-10" />

                <div className="container mx-auto px-4 text-center space-y-8">
                    <div className="animate-fade-in [animation-delay:200ms] inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-violet-300">
                        <Zap className="h-4 w-4 fill-violet-400" />
                        Discover the future of shopping
                    </div>

                    <h1 className="animate-fade-in [animation-delay:400ms] text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.1]">
                        Elevate Your <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Lifestyle</span> <br className="hidden md:block" /> with ShopifyPro
                    </h1>

                    <p className="animate-fade-in [animation-delay:600ms] text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Experience the next generation of premium shopping. Handpicked collections,
                        blazing-fast delivery, and an interface that feels like magic.
                    </p>

                    <div className="animate-fade-in [animation-delay:800ms] flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/products" className="btn-primary gap-2 min-w-[180px]">
                            Explore Shop <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link href="/register" className="btn-secondary min-w-[180px]">
                            Join Community
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="container mx-auto px-4">
                <div className="flex items-end justify-between mb-10">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-white">Featured Drops</h2>
                        <p className="text-slate-400">The most trending items right now</p>
                    </div>
                    <Link href="/products" className="text-sm font-bold text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1 group">
                        View All Products
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                        [...Array(4)].map((_, i) => <ProductSkeleton key={i} />)
                    ) : error ? (
                        <div className="col-span-full py-20 glass-card bg-red-500/5 border-red-500/20 text-center space-y-4">
                            <Zap className="h-10 w-10 text-red-500 mx-auto" />
                            <p className="text-slate-400 font-medium">{error}</p>
                        </div>
                    ) : (
                        featuredProducts.map((p) => <ProductCard key={p.id} product={p} />)
                    )}
                </div>
            </section>

            {/* Features Banner */}
            <section className="container mx-auto px-4">
                <div className="glass-card grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 p-4">
                    <Feature
                        Icon={Truck}
                        title="Express Shipping"
                        desc="Global delivery within 48 hours for premium members."
                    />
                    <Feature
                        Icon={ShieldCheck}
                        title="Secure Checkout"
                        desc="Military-grade encryption for all your transactions."
                    />
                    <Feature
                        Icon={ShoppingBag}
                        title="Boutique Quality"
                        desc="Every item in our shop is hand-verified for excellence."
                    />
                </div>
            </section>
        </div>
    );
}

function Feature({ Icon, title, desc }: { Icon: any; title: string; desc: string }) {
    return (
        <div className="p-8 flex items-start gap-4">
            <div className="h-12 w-12 shrink-0 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20">
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <h3 className="font-bold text-white text-lg mb-1">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}
