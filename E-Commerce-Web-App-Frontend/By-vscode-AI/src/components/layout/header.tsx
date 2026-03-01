"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";

const navItems = [
    { href: "/", label: "Shop" },
    { href: "/cart", label: "Cart" },
    { href: "/orders", label: "Orders" },
];

export function Header() {
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuth();
    const { totalItems } = useCart();

    return (
        <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
                <Link href="/" className="text-lg font-bold text-slate-900">
                    MVP Store
                </Link>

                <nav className="flex items-center gap-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm font-medium transition hover:text-slate-900 ${isActive ? "text-slate-900" : "text-slate-600"
                                    }`}
                            >
                                {item.label}
                                {item.href === "/cart" && totalItems > 0 ? ` (${totalItems})` : ""}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-2">
                    {isAuthenticated ? (
                        <>
                            <span className="hidden text-sm text-slate-600 md:block">
                                {user?.name || user?.email}
                            </span>
                            <Button variant="secondary" onClick={logout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                                Login
                            </Link>
                            <Link href="/register" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
