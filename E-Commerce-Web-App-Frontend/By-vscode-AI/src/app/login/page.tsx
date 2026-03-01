"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await login(form);
            router.push("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="mx-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="mb-1 text-2xl font-bold text-slate-900">Welcome back</h1>
            <p className="mb-6 text-sm text-slate-600">Sign in to continue shopping.</p>

            <form className="space-y-4" onSubmit={onSubmit}>
                <Input
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    required
                />
                <Input
                    label="Password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                    required
                />

                {error ? <p className="text-sm text-red-600">{error}</p> : null}

                <Button type="submit" className="w-full" isLoading={isLoading}>
                    Login
                </Button>
            </form>

            <p className="mt-4 text-center text-sm text-slate-600">
                New here?{" "}
                <Link href="/register" className="font-medium text-slate-900 underline">
                    Create account
                </Link>
            </p>
        </section>
    );
}
