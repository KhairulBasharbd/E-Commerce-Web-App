import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export function Input({ label, id, error, className = "", ...props }: InputProps) {
    return (
        <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">{label}</span>
            <input
                id={id}
                className={`w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 ${className}`}
                {...props}
            />
            {error ? <span className="text-xs text-red-600">{error}</span> : null}
        </label>
    );
}
