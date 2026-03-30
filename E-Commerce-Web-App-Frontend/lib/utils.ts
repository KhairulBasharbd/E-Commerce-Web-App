import { jwtDecode } from 'jwt-decode';
import type { Role } from '@/types';

interface JwtPayload {
    sub: string; // email
    role?: Role;
    roles?: string[];
    exp: number;
}

export function decodeToken(token: string): { email: string; role: Role } | null {
    try {
        const payload = jwtDecode<JwtPayload>(token);
        // Spring Security can encode roles differently
        let role: Role = 'CUSTOMER';
        if (payload.role) {
            role = payload.role;
        } else if (payload.roles) {
            const found = payload.roles.find((r) => r.includes('ADMIN'));
            role = found ? 'ADMIN' : 'CUSTOMER';
        }
        return { email: payload.sub, role };
    } catch {
        return null;
    }
}

export function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
}

export function computeCartTotal(
    items: { price: number; quantity: number }[]
): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getOrderStatusColor(status: string): string {
    switch (status) {
        case 'CREATED':
            return 'text-yellow-400';
        case 'CONFIRMED':
            return 'text-blue-400';
        case 'SHIPPED':
            return 'text-purple-400';
        case 'DELIVERED':
            return 'text-green-400';
        default:
            return 'text-gray-400';
    }
}
