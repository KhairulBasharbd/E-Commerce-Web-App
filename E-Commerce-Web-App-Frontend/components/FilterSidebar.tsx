'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { ProductFilters } from '@/types';

interface FilterSidebarProps {
    filters: ProductFilters;
    onChange: (filters: ProductFilters) => void;
}

const CATEGORIES = [
    'ALL',
    'ELECTRONICS',
    'CLOTHING',
    'FOOD',
    'BOOKS',
    'SPORTS'
];

export default function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
    const updateFilter = (key: keyof ProductFilters, value: any) => {
        onChange({ ...filters, [key]: value, page: 0 }); // Reset to first page
    };

    const clearFilters = () => {
        onChange({ page: 0 });
    };

    return (
        <aside className="glass-card p-6 h-fit sticky top-24 w-full lg:w-72 space-y-8">
            {/* Search */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Search className="h-4 w-4 text-violet-400" />
                        Search
                    </h3>
                    <button
                        onClick={clearFilters}
                        className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                    >
                        Clear All
                    </button>
                </div>
                <input
                    type="text"
                    placeholder="Product name..."
                    value={filters.name || ''}
                    onChange={(e) => updateFilter('name', e.target.value)}
                    className="input-field text-sm"
                />
            </div>

            {/* Categories */}
            <div className="space-y-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-violet-400" />
                    Category
                </h3>
                <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => updateFilter('category', cat === 'ALL' ? undefined : cat)}
                            className={`text-sm text-left px-3 py-2 rounded-lg transition-all ${(cat === 'ALL' && !filters.category) || filters.category === cat
                                    ? 'bg-violet-500/20 text-violet-300 font-medium border border-violet-500/30'
                                    : 'text-slate-400 hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            {cat.charAt(0) + cat.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
                <h3 className="font-bold text-white">Price Range</h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-slate-500 ml-1">Min</span>
                        <input
                            type="number"
                            placeholder="0"
                            value={filters.minPrice || ''}
                            onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                            className="input-field text-sm px-3 py-2"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-slate-500 ml-1">Max</span>
                        <input
                            type="number"
                            placeholder="Any"
                            value={filters.maxPrice || ''}
                            onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                            className="input-field text-sm px-3 py-2"
                        />
                    </div>
                </div>
            </div>
        </aside>
    );
}
