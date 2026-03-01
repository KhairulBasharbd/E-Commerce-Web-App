'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { cartApi } from '@/lib/api';
import type { CartResponse } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/Toast';

interface CartContextValue {
    cart: CartResponse | null;
    itemCount: number;
    refreshCart: () => Promise<void>;
    clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartResponse | null>(null);
    const { isAuthenticated, isAdmin } = useAuth();

    const refreshCart = useCallback(async () => {
        if (!isAuthenticated || isAdmin) return;
        try {
            const data = await cartApi.get();
            setCart(data);
        } catch (error) {
            setCart(null);
            // We don't toast on every background refresh error to avoid spam, 
            // but logging it is important.
            console.error('Cart refresh error:', error);
        }
    }, [isAuthenticated, isAdmin]);

    const clearCart = () => setCart(null);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

    return (
        <CartContext.Provider value={{ cart, itemCount, refreshCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be inside CartProvider');
    return ctx;
}
