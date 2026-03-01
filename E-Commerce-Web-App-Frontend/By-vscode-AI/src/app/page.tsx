"use client";

import { useEffect, useMemo, useState } from "react";
import { productService } from "@/services/product.service";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types/api";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadProducts();
  }, []);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(value) ||
        p.description.toLowerCase().includes(value),
    );
  }, [products, query]);

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Explore Products</h1>
        <p className="text-sm text-slate-600">
          Browse and add your favorite items from your Java backend inventory.
        </p>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-900"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : error ? (
        <p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-600">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
