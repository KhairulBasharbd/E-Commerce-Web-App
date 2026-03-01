import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-500 disabled:cursor-not-allowed",
    secondary:
        "bg-white text-slate-900 border border-slate-300 hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed",
    danger:
        "bg-red-600 text-white hover:bg-red-500 disabled:bg-red-400 disabled:cursor-not-allowed",
};

export function Button({
    children,
    className = "",
    variant = "primary",
    isLoading,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition ${variantStyles[variant]} ${className}`}
            disabled={props.disabled || isLoading}
            {...props}
        >
            {isLoading ? "Please wait..." : children}
        </button>
    );
}
