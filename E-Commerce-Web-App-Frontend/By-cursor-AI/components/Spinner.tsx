'use client';

import { Loader2 } from 'lucide-react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' };

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
    return (
        <Loader2
            className={`animate-spin text-violet-400 ${sizes[size]} ${className}`}
        />
    );
}

export function PageLoader() {
    return (
        <div className="flex min-h-[50vh] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <Spinner size="lg" />
                <p className="text-sm text-slate-400 animate-pulse">Loading…</p>
            </div>
        </div>
    );
}

export function ProductSkeleton() {
    return (
        <div className="rounded-2xl border border-white/5 bg-white/5 overflow-hidden animate-pulse">
            <div className="h-48 bg-white/10" />
            <div className="p-4 space-y-3">
                <div className="h-4 w-2/3 rounded bg-white/10" />
                <div className="h-3 w-full rounded bg-white/10" />
                <div className="h-3 w-1/2 rounded bg-white/10" />
                <div className="flex justify-between items-center pt-2">
                    <div className="h-5 w-20 rounded bg-white/10" />
                    <div className="h-9 w-28 rounded-xl bg-white/10" />
                </div>
            </div>
        </div>
    );
}
