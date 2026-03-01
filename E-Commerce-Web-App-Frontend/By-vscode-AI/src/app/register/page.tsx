"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await register(form);
            router.push("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Registration failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="mx-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="mb-1 text-2xl font-bold text-slate-900">Create account</h1>
            <p className="mb-6 text-sm text-slate-600">Join and start your first order.</p>

            <form className="space-y-4" onSubmit={onSubmit}>
                <Input
                    label="Name"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    required
                />
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
                    minLength={6}
                />

                {error ? <p className="text-sm text-red-600">{error}</p> : null}

                <Button type="submit" className="w-full" isLoading={isLoading}>
                    Register
                </Button>
            </form>

            <p className="mt-4 text-center text-sm text-slate-600">
                Already registered?{" "}
                <Link href="/login" className="font-medium text-slate-900 underline">
                    Sign in
                </Link>
            </p>
        </section>
    );
}
