"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import type { Product } from "@/types/api";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();

    const onAdd = async () => {
        try {
            await addToCart(product.id, 1);
            alert("Item added to cart.");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Could not add item.";
            alert(message);
        }
    };

    return (
        <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
            <div className="relative h-48 w-full bg-slate-100">
                <Image
                    src={product.imageUrl || "https://picsum.photos/600/400"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
            </div>
            <div className="space-y-3 p-4">
                <h3 className="line-clamp-1 text-lg font-semibold text-slate-900">{product.name}</h3>
                <p className="line-clamp-2 text-sm text-slate-600">{product.description}</p>
                <div className="flex items-center justify-between">
                    <p className="text-base font-bold text-slate-900">${product.price.toFixed(2)}</p>
                    <span className="text-xs text-slate-500">Stock: {product.stock}</span>
                </div>
                <div className="flex gap-2">
                    <Link
                        href={`/products/${product.id}`}
                        className="inline-flex flex-1 items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                        Details
                    </Link>
                    <Button className="flex-1" onClick={onAdd} disabled={product.stock <= 0}>
                        Add
                    </Button>
                </div>
            </div>
        </article>
    );
}
