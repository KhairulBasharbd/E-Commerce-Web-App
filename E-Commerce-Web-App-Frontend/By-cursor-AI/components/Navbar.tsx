'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, LogOut, ShieldCheck, Package, User } from 'lucide-react';

export default function Navbar() {
    const { user, logout, isAdmin, isAuthenticated } = useAuth();
    const { itemCount } = useCart();
    const pathname = usePathname();

    const isActive = (href: string) => pathname === href;

    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg group-hover:shadow-violet-500/30 transition-shadow">
                        <Package className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-white tracking-tight">
                        Shopify<span className="text-violet-400">Pro</span>
                    </span>
                </Link>

                {/* Nav Links */}
                <nav className="hidden md:flex items-center gap-1">
                    <NavLink href="/" active={isActive('/')}>Home</NavLink>
                    <NavLink href="/products" active={pathname.startsWith('/products')}>Products</NavLink>
                    {isAdmin && (
                        <NavLink href="/admin/products" active={pathname.startsWith('/admin')}>
                            <ShieldCheck className="h-4 w-4 mr-1" />
                            Admin
                        </NavLink>
                    )}
                </nav>

                {/* Right Side */}
                <div className="flex items-center gap-3">
                    {isAuthenticated && !isAdmin && (
                        <Link
                            href="/cart"
                            className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                        >
                            <ShoppingCart className="h-4 w-4 text-slate-300" />
                            {itemCount > 0 && (
                                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white shadow-lg">
                                    {itemCount > 99 ? '99+' : itemCount}
                                </span>
                            )}
                        </Link>
                    )}

                    {isAuthenticated ? (
                        <div className="flex items-center gap-2">
                            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                                <User className="h-3.5 w-3.5 text-violet-400" />
                                <span className="text-xs text-slate-300 max-w-[120px] truncate">{user?.email}</span>
                                {isAdmin && (
                                    <span className="text-[10px] uppercase font-bold text-violet-400 bg-violet-400/10 px-1.5 py-0.5 rounded">
                                        Admin
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className="px-4 py-1.5 rounded-xl text-sm text-slate-300 hover:text-white border border-white/10 hover:bg-white/5 transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="px-4 py-1.5 rounded-xl text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-lg hover:shadow-violet-500/25 transition-all"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
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
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active
                    ? 'bg-violet-500/20 text-violet-300'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
        >
            {children}
        </Link>
    );
}
