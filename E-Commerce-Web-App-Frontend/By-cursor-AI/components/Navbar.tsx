'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, LogOut, ShieldCheck, Package, User, Search, Heart, Menu, X } from 'lucide-react';

export default function Navbar() {
    const { user, logout, isAdmin, isAuthenticated } = useAuth();
    const { itemCount } = useCart();
    const pathname = usePathname();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (href: string) => pathname === href;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?name=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg group-hover:shadow-violet-500/30 transition-all duration-300 group-hover:scale-105">
                            <Package className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-black text-white tracking-tight hidden sm:block">
                            Shopify<span className="text-violet-400">Pro</span>
                        </span>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <form 
                        onSubmit={handleSearch}
                        className="hidden md:flex flex-1 max-w-md relative group"
                    >
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
                        <input 
                            type="text"
                            placeholder="Search premium products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                        />
                    </form>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center gap-6">
                        <nav className="flex items-center gap-1">
                            <NavLink href="/" active={isActive('/')}>Home</NavLink>
                            <NavLink href="/products" active={pathname.startsWith('/products')}>Shop</NavLink>
                            {isAdmin && (
                                <NavLink href="/admin/products" active={pathname.startsWith('/admin')}>
                                    <ShieldCheck className="h-4 w-4 mr-1.5 text-violet-400" />
                                    Admin
                                </NavLink>
                            )}
                        </nav>

                        <div className="h-6 w-px bg-white/10" />

                        <div className="flex items-center gap-4">
                            {isAuthenticated && (
                                <button className="p-2 text-slate-400 hover:text-white transition-colors">
                                    <Heart className="h-5 w-5" />
                                </button>
                            )}

                            {!isAdmin && (
                                <Link
                                    href="/cart"
                                    className="relative p-2 text-slate-400 hover:text-white transition-colors"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    {itemCount > 0 && (
                                        <span className="absolute -right-0.5 top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white shadow-lg ring-2 ring-slate-900 animate-fade-in">
                                            {itemCount > 99 ? '99+' : itemCount}
                                        </span>
                                    )}
                                </Link>
                            )}

                            {isAuthenticated ? (
                                <div className="flex items-center gap-3 ml-2">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-sm">
                                        <div className="h-6 w-6 rounded-lg bg-violet-500/20 flex items-center justify-center">
                                            <User className="h-3.5 w-3.5 text-violet-400" />
                                        </div>
                                        <span className="text-slate-200 max-w-[100px] truncate">{user?.email}</span>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link
                                        href="/login"
                                        className="text-sm font-bold text-slate-400 hover:text-white transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-lg hover:shadow-violet-500/25 transition-all"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        className="lg:hidden p-2 text-slate-400 hover:text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden border-t border-white/10 bg-slate-900 px-4 py-6 space-y-6 animate-fade-in">
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input 
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
                        />
                    </form>
                    <nav className="flex flex-col gap-2">
                        <Link href="/" className="px-4 py-3 rounded-xl bg-white/5 text-white font-bold">Home</Link>
                        <Link href="/products" className="px-4 py-3 rounded-xl hover:bg-white/5 text-slate-300">Shop</Link>
                        {!isAdmin && <Link href="/cart" className="px-4 py-3 rounded-xl hover:bg-white/5 text-slate-300">Cart ({itemCount})</Link>}
                        {isAdmin && <Link href="/admin/products" className="px-4 py-3 rounded-xl hover:bg-white/5 text-slate-300">Admin</Link>}
                    </nav>
                    {isAuthenticated ? (
                        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                            <span className="text-sm text-slate-400">{user?.email}</span>
                            <button onClick={logout} className="text-red-400 font-bold flex items-center gap-2">
                                <LogOut className="h-4 w-4" /> Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <Link href="/login" className="w-full btn-secondary">Login</Link>
                            <Link href="/register" className="w-full btn-primary">Sign Up</Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}

function NavLink({
    href,
    active,
    children,
}: {
    href: string;
    active: boolean;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className={`flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${active
                    ? 'bg-violet-600/10 text-violet-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
        >
            {children}
        </Link>
    );
}
