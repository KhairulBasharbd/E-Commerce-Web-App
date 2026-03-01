export type Role = "USER" | "ADMIN";

export interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl?: string;
    category?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CartItem {
    id: number;
    productId: number;
    quantity: number;
    product: Product;
}

export interface Cart {
    id: number;
    userId: number;
    items: CartItem[];
}

export interface OrderItem {
    id: number;
    quantity: number;
    unitPrice: number;
    product: Product;
}

export interface Order {
    id: number;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
}

export interface CreateOrderPayload {
    shippingAddress: string;
}

export interface AddToCartPayload {
    productId: number;
    quantity: number;
}

export interface UpdateCartItemPayload {
    quantity: number;
}
