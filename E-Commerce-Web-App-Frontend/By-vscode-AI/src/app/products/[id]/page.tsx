"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { productService } from "@/services/product.service";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/api";

export default function ProductDetailsPage() {
    const params = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addToCart } = useCart();

    useEffect(() => {
        const run = async () => {
            try {
                setIsLoading(true);
                const data = await productService.getById(params.id);
                setProduct(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load product.");
            } finally {
                setIsLoading(false);
            }
        };

        void run();
    }, [params.id]);

    const handleAdd = async () => {
        if (!product) return;
        try {
            await addToCart(product.id, 1);
            alert("Added to cart.");
        } catch (err) {
            alert(err instanceof Error ? err.message : "Could not add to cart.");
        }
    };

    if (isLoading) {
        return <div className="h-96 animate-pulse rounded-xl bg-slate-200" />;
    }

    if (error || !product) {
        return (
            <div className="space-y-4 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
                <p>{error || "Product not found."}</p>
                <Link href="/" className="text-sm font-medium underline">
                    Go back to shop
                </Link>
            </div>
        );
    }

    return (
        <section className="grid gap-6 rounded-xl border border-slate-200 bg-white p-6 md:grid-cols-2">
            <div className="relative min-h-72 overflow-hidden rounded-lg bg-slate-100">
                <Image
                    src={product.imageUrl || "https://picsum.photos/900/600"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>

            <div className="space-y-4">
                <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
                <p className="text-sm text-slate-600">{product.description}</p>
                <p className="text-xl font-semibold text-slate-900">${product.price.toFixed(2)}</p>
                <p className="text-sm text-slate-500">Available stock: {product.stock}</p>

                <div className="flex gap-2">
                    <Button onClick={handleAdd} disabled={product.stock <= 0}>
                        Add to cart
                    </Button>
                    <Link
                        href="/cart"
                        className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                        View cart
                    </Link>
                </div>
            </div>
        </section>
    );
}
