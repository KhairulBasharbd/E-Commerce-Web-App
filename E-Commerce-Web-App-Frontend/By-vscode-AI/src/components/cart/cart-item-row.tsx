"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import type { CartItem } from "@/types/api";

interface CartItemRowProps {
    item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
    const { updateQuantity, removeItem } = useCart();

    return (
        <div className="grid grid-cols-1 items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[80px_1fr_auto_auto]">
            <div className="relative h-20 w-20 overflow-hidden rounded-md bg-slate-100">
                <Image
                    src={item.product.imageUrl || "https://picsum.photos/300/200"}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                />
            </div>

            <div>
                <h3 className="text-sm font-semibold text-slate-900">{item.product.name}</h3>
                <p className="text-xs text-slate-500">${item.product.price.toFixed(2)} each</p>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="secondary"
                    className="px-3 py-1"
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                >
                    -
                </Button>
                <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                <Button
                    variant="secondary"
                    className="px-3 py-1"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                    +
                </Button>
            </div>

            <div className="space-y-2 text-right">
                <p className="text-sm font-semibold text-slate-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                </p>
                <Button variant="danger" className="px-3 py-1" onClick={() => removeItem(item.id)}>
                    Remove
                </Button>
            </div>
        </div>
    );
}
