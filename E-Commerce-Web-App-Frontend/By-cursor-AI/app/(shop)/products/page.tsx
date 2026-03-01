'use client';

import { useEffect, useState } from 'react';
import { productsApi } from '@/lib/api';
import type { Product, ProductPage, ProductFilters } from '@/types';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import Pagination from '@/components/Pagination';
import { ProductSkeleton } from '@/components/Spinner';
import { ShoppingBag, Zap } from 'lucide-react';

import { toast } from '@/components/Toast';

export default function ProductsPage() {
    const [data, setData] = useState<ProductPage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<ProductFilters>({
        active: true,
        page: 0,
        size: 8,
    });

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

    return (
        <div className="container mx-auto px-4 pt-12">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters */}
                <FilterSidebar filters={filters} onChange={setFilters} />

                {/* Content */}
                <div className="flex-1 space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                                All Products
                                <span className="text-sm font-normal text-slate-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg">
                                    {data?.totalElements || 0} items
                                </span>
                            </h1>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 glass-card border-red-500/20 bg-red-500/5 animate-fade-in">
                            <div className="h-20 w-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                                <Zap className="h-10 w-10 text-red-400" />
                            </div>
                            <div className="space-y-2 max-w-md">
                                <h3 className="text-2xl font-bold text-white">Service Unavailable</h3>
                                <p className="text-slate-400">
                                    {error}
                                </p>
                            </div>
                            <button
                                onClick={() => setFilters({ ...filters })}
                                className="btn-secondary h-12 px-8"
                            >
                                Try Reconnecting
                            </button>
                        </div>
                    ) : data?.content && data.content.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {data.content.map((p) => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>
                            <Pagination
                                currentPage={filters.page || 0}
                                totalPages={data.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                            <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                                <ShoppingBag className="h-8 w-8 text-slate-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">No products found</h3>
                                <p className="text-slate-400">Try adjusting your filters to find what you're looking for.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
