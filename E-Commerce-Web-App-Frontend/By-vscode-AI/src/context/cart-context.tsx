"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { cartService } from "@/services/cart.service";
import { useAuth } from "@/context/auth-context";
import type { CartItem } from "@/types/api";

interface CartContextValue {
    items: CartItem[];
    totalItems: number;
    subtotal: number;
    isLoading: boolean;
    refreshCart: () => Promise<void>;
    addToCart: (productId: number, quantity?: number) => Promise<void>;
    updateQuantity: (itemId: number, quantity: number) => Promise<void>;
    removeItem: (itemId: number) => Promise<void>;
    clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { token, isAuthenticated } = useAuth();
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const refreshCart = useCallback(async () => {
        if (!token) {
            setItems([]);
            return;
        }
        setIsLoading(true);
        try {
            const cart = await cartService.getCart(token);
            setItems(cart.items || []);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (isAuthenticated) {
            void refreshCart();
            return;
        }
        setItems([]);
    }, [isAuthenticated, refreshCart]);

    const addToCart = useCallback(
        async (productId: number, quantity = 1) => {
            if (!token) throw new Error("Please login to add items to cart.");
            const cart = await cartService.addItem({ productId, quantity }, token);
            setItems(cart.items || []);
        },
        [token],
    );

    const updateQuantity = useCallback(
        async (itemId: number, quantity: number) => {
            if (!token) throw new Error("Please login to update cart.");
            const cart = await cartService.updateItem(itemId, { quantity }, token);
            setItems(cart.items || []);
        },
        [token],
    );

    const removeItem = useCallback(
        async (itemId: number) => {
            if (!token) throw new Error("Please login to update cart.");
            const cart = await cartService.removeItem(itemId, token);
            setItems(cart.items || []);
        },
        [token],
    );

    const clearCart = useCallback(async () => {
        if (!token) return;
        await cartService.clear(token);
        setItems([]);
    }, [token]);

    const totalItems = useMemo(
        () => items.reduce((sum, item) => sum + item.quantity, 0),
        [items],
    );

    const subtotal = useMemo(
        () => items.reduce((sum, item) => sum + item.quantity * item.product.price, 0),
        [items],
    );

    const value = useMemo<CartContextValue>(
        () => ({
            items,
            totalItems,
            subtotal,
            isLoading,
            refreshCart,
            addToCart,
            updateQuantity,
            removeItem,
            clearCart,
        }),
        [
            addToCart,
            clearCart,
            isLoading,
            items,
            refreshCart,
            removeItem,
            subtotal,
            totalItems,
            updateQuantity,
        ],
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error("useCart must be used within CartProvider");
    }
    return ctx;
};
