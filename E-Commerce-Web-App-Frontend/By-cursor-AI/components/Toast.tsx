'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
}

// Global toast store (simple singleton)
type Listener = (toasts: ToastMessage[]) => void;
const listeners: Set<Listener> = new Set();
let toasts: ToastMessage[] = [];

function publish(next: ToastMessage[]) {
    toasts = next;
    listeners.forEach((l) => l(toasts));
}

export const toast = {
    success: (message: string) => addToast(message, 'success'),
    error: (message: string) => addToast(message, 'error'),
    info: (message: string) => addToast(message, 'info'),
};

function addToast(message: string, type: ToastType) {
    const id = Math.random().toString(36).slice(2);
    publish([...toasts, { id, message, type }]);
    setTimeout(() => {
        publish(toasts.filter((t) => t.id !== id));
    }, 4000);
}

const ICONS = {
    success: <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />,
    error: <XCircle className="h-4 w-4 text-red-400 shrink-0" />,
    info: <AlertCircle className="h-4 w-4 text-blue-400 shrink-0" />,
};

const BG = {
    success: 'border-emerald-500/30 bg-emerald-500/10',
    error: 'border-red-500/30 bg-red-500/10',
    info: 'border-blue-500/30 bg-blue-500/10',
};

export function ToastContainer() {
    const [items, setItems] = useState<ToastMessage[]>([]);

    useEffect(() => {
        const listener: Listener = (next) => setItems([...next]);
        listeners.add(listener);
        return () => { listeners.delete(listener); };
    }, []);

    if (items.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm w-full">
            {items.map((t) => (
                <div
                    key={t.id}
                    className={`flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl animate-in slide-in-from-right-5 ${BG[t.type]}`}
                >
                    {ICONS[t.type]}
                    <p className="text-sm text-slate-200 flex-1">{t.message}</p>
                    <button
                        onClick={() => publish(toasts.filter((x) => x.id !== t.id))}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            ))}
        </div>
    );
}
