'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { productsApi } from '@/lib/api';
import type { Product, ProductPage, ProductFilters } from '@/types';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import Pagination from '@/components/Pagination';
import { ProductSkeleton } from '@/components/Spinner';
import { ShoppingBag, Zap, ArrowUpDown } from 'lucide-react';

import { toast } from '@/components/Toast';

function ProductsContent() {
    const searchParams = useSearchParams();
    const [data, setData] = useState<ProductPage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<ProductFilters>({
        active: true,
        page: 0,
        size: 9,
    });

    // Initialize filters from URL
    useEffect(() => {
        const category = searchParams.get('category');
        const name = searchParams.get('name');
        
        setFilters(prev => ({
            ...prev,
            category: category || undefined,
            name: name || undefined,
            page: 0
        }));
    }, [searchParams]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await productsApi.list(filters);
                setData(result);
            } catch (err: any) {
                const msg = 'Unable to connect to service. Please ensure backend is running.';
                setError(msg);
                toast.error(msg);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [filters]);

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSortChange = (sort: string) => {
        setFilters(prev => ({ ...prev, sort, page: 0 }));
    };

    return (
        <div className="container mx-auto px-4 pt-12">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Filters */}
                <FilterSidebar filters={filters} onChange={setFilters} />

                {/* Content */}
                <div className="flex-1 space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
                                {filters.category ? filters.category.replace('_', ' ') : 'Our Collection'}
                                <span className="text-xs font-bold text-slate-500 bg-white/5 border border-white/10 px-3 py-1 rounded-full uppercase tracking-widest">
                                    {data?.totalElements || 0} Total Items
                                </span>
                            </h1>
                        </div>

                        <div className="flex items-center gap-2">
                            <ArrowUpDown className="h-4 w-4 text-slate-500" />
                            <select 
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="bg-slate-900 border border-white/10 text-sm text-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-violet-500/50 outline-none transition-all cursor-pointer"
                            >
                                <option value="">Newest Arrivals</option>
                                <option value="price,asc">Price: Low to High</option>
                                <option value="price,desc">Price: High to Low</option>
                                <option value="name,asc">Name: A to Z</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 glass-card border-red-500/20 bg-red-500/5 animate-fade-in shadow-2xl">
                            <div className="h-24 w-24 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 shadow-red-500/5">
                                <Zap className="h-12 w-12 text-red-400" />
                            </div>
                            <div className="space-y-2 max-w-md">
                                <h3 className="text-3xl font-black text-white tracking-tight">System Offline</h3>
                                <p className="text-slate-400 leading-relaxed font-medium">
                                    {error}
                                </p>
                            </div>
                            <button
                                onClick={() => setFilters({ ...filters })}
                                className="btn-primary h-14 px-10 text-lg shadow-red-500/10"
                            >
                                Try Connecting Again
                            </button>
                        </div>
                    ) : data?.content && data.content.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-fade-in">
                                {data.content.map((p) => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>
                            <div className="pt-10 flex justify-center">
                                <Pagination
                                    currentPage={filters.page || 0}
                                    totalPages={data.totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 glass-card animate-fade-in">
                            <div className="h-20 w-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 rotate-3">
                                <ShoppingBag className="h-10 w-10 text-slate-700" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-white tracking-tight">Nothing Found</h3>
                                <p className="text-slate-400 max-w-xs mx-auto">We couldn't find any products matching your current filters.</p>
                            </div>
                            <button 
                                onClick={() => setFilters({ active: true, page: 0, size: 9 })}
                                className="text-violet-400 font-bold hover:text-violet-300 transition-colors underline underline-offset-8"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto px-4 py-32 text-center">
                <div className="animate-pulse text-slate-500 font-medium">Loading catalog...</div>
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}
