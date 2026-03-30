'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, Truck, ShieldCheck, Zap, Star, Globe, Clock } from 'lucide-react';
import { productsApi } from '@/lib/api';
import type { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { ProductSkeleton } from '@/components/Spinner';
import { toast } from '@/components/Toast';
import Footer from '@/components/Footer';

const CATEGORIES = [
    { name: 'Electronics', slug: 'ELECTRONICS', icon: '💻', count: '120+' },
    { name: 'Fashion', slug: 'FASHION', icon: '👗', count: '450+' },
    { name: 'Home & Living', slug: 'HOME_LIVING', icon: '🏠', count: '80+' },
    { name: 'Accessories', slug: 'ACCESSORIES', icon: '⌚', count: '210+' },
];

export default function LandingPage() {
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
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 space-y-20 pb-20">
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-20 pb-32">
                    {/* Background Blobs */}
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] -z-10 animate-pulse" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -z-10 animate-pulse [animation-delay:1s]" />

                    <div className="container mx-auto px-4 text-center space-y-8">
                        <div className="animate-fade-in inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-violet-300 backdrop-blur-sm">
                            <Star className="h-4 w-4 fill-violet-400 text-violet-400" />
                            Rated #1 Premium Shopping Experience
                        </div>

                        <h1 className="animate-fade-in text-5xl md:text-8xl font-black text-white tracking-tight leading-[1.05] [animation-delay:200ms]">
                            Future of <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">E-Commerce</span> <br className="hidden md:block" /> is already here.
                        </h1>

                        <p className="animate-fade-in text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed [animation-delay:400ms]">
                            ShopifyPro delivers a curated collection of premium goods with 
                            unmatched speed and security. Elevate your lifestyle today.
                        </p>

                        <div className="animate-fade-in flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 [animation-delay:600ms]">
                            <Link href="/products" className="btn-primary gap-2 min-w-[200px] group text-lg">
                                Start Shopping <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/register" className="btn-secondary min-w-[200px] text-lg">
                                Join Now
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="animate-fade-in grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 max-w-4xl mx-auto [animation-delay:800ms]">
                            <Stat label="Active Users" value="50k+" />
                            <Stat label="Total Products" value="10k+" />
                            <Stat label="Countries" value="40+" />
                            <Stat label="Reviews" value="4.9/5" />
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="container mx-auto px-4">
                    <div className="text-center mb-12 space-y-3">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Browse Categories</h2>
                        <p className="text-slate-400">Find exactly what you're looking for</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {CATEGORIES.map((cat, i) => (
                            <Link 
                                key={cat.slug} 
                                href={`/products?category=${cat.slug}`}
                                className="glass-card-hover p-8 text-center space-y-4 group"
                            >
                                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                    {cat.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors">{cat.name}</h3>
                                <p className="text-sm text-slate-500 font-medium">{cat.count} Items Available</p>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Featured Products */}
                <section className="container mx-auto px-4">
                    <div className="flex items-end justify-between mb-12">
                        <div className="space-y-3">
                            <h2 className="text-3xl md:text-4xl font-bold text-white">Trending Now</h2>
                            <p className="text-slate-400">Handpicked premium selections for you</p>
                        </div>
                        <Link href="/products" className="text-sm font-bold text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1 group">
                            View Collection
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

                {/* Trust Section */}
                <section className="container mx-auto px-4">
                    <div className="glass-card-premium grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
                        <Feature
                            Icon={Truck}
                            title="Global Shipping"
                            desc="Free express delivery on orders over $500. Tracked every step."
                        />
                        <Feature
                            Icon={Clock}
                            title="24/7 Support"
                            desc="Dedicated expert team ready to help you anytime, anywhere."
                        />
                        <Feature
                            Icon={ShieldCheck}
                            title="Secure Payments"
                            desc="End-to-end encrypted transactions for your peace of mind."
                        />
                    </div>
                </section>

                {/* Newsletter */}
                <section className="container mx-auto px-4">
                    <div className="glass-card bg-gradient-to-r from-violet-600/20 to-indigo-600/20 p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl" />
                        
                        <div className="relative z-10 space-y-4">
                            <h2 className="text-3xl md:text-5xl font-black text-white">Join the Elite Club</h2>
                            <p className="text-slate-400 max-w-xl mx-auto">
                                Get exclusive early access to new drops and premium member-only discounts.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto pt-4">
                                <input 
                                    type="email" 
                                    placeholder="your@email.com" 
                                    className="input-field"
                                />
                                <button className="btn-primary sm:w-32">Join</button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="space-y-1">
            <div className="text-3xl font-black text-white">{value}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</div>
        </div>
    );
}

function Feature({ Icon, title, desc }: { Icon: any; title: string; desc: string }) {
    return (
        <div className="p-10 flex flex-col items-center text-center gap-4 hover:bg-white/5 transition-colors">
            <div className="h-14 w-14 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20">
                <Icon className="h-7 w-7" />
            </div>
            <div>
                <h3 className="font-bold text-white text-xl mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}
