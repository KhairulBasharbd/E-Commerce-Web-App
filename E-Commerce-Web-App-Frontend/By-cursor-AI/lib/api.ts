import axios from 'axios';
import type {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    ProductPage,
    ProductFilters,
    ProductAdminRequest,
    Product,
    CartResponse,
    CartItemRequest,
    OrderResponse,
} from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// ──────────────────────────────────────────────
// Request interceptor – attach JWT token
// ──────────────────────────────────────────────
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// ──────────────────────────────────────────────
// Response interceptor – handle 401
// ──────────────────────────────────────────────
api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ──────────────────────────────────────────────
// Auth
// ──────────────────────────────────────────────
export const authApi = {
    register: (data: RegisterRequest) =>
        api.post<AuthResponse>('/auth/register', data).then((r) => r.data),
    login: (data: LoginRequest) =>
        api.post<AuthResponse>('/auth/login', data).then((r) => r.data),
};

// ──────────────────────────────────────────────
// Products
// ──────────────────────────────────────────────
export const productsApi = {
    list: (filters: ProductFilters = {}) => {
        const params: Record<string, string | number | boolean> = {};
        if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
        if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
        if (filters.category) params.category = filters.category;
        if (filters.name) params.name = filters.name;
        if (filters.active !== undefined) params.active = filters.active;
        if (filters.page !== undefined) params.page = filters.page;
        if (filters.size !== undefined) params.size = filters.size ?? 12;
        if (filters.sort) params.sort = filters.sort;
        return api.get<ProductPage>('/products', { params }).then((r) => r.data);
    },
    getById: (id: string) =>
        api.get<Product>(`/products/${id}`).then((r) => r.data),
};

// ──────────────────────────────────────────────
// Cart
// ──────────────────────────────────────────────
export const cartApi = {
    get: () => api.get<CartResponse>('/cart').then((r) => r.data),
    addItem: (data: CartItemRequest) =>
        api.post<CartResponse>('/cart/items', data).then((r) => r.data),
    updateItem: (data: CartItemRequest) =>
        api.put<CartResponse>('/cart/items', data).then((r) => r.data),
    removeItem: (productId: string) =>
        api.delete<CartResponse>(`/cart/items/${productId}`).then((r) => r.data),
};

// ──────────────────────────────────────────────
// Orders
// ──────────────────────────────────────────────
export const ordersApi = {
    place: () => api.post<OrderResponse>('/orders').then((r) => r.data),
};

// ──────────────────────────────────────────────
// Payments
// ──────────────────────────────────────────────
export const paymentsApi = {
    pay: (orderId: string) => api.post(`/payments/${orderId}`).then((r) => r.data),
};

// ──────────────────────────────────────────────
// Admin
// ──────────────────────────────────────────────
export const adminApi = {
    createProduct: (data: ProductAdminRequest) =>
        api.post<Product>('/admin/products', data).then((r) => r.data),
    updateProduct: (id: string, data: ProductAdminRequest) =>
        api.put<Product>(`/admin/products/${id}`, data).then((r) => r.data),
};
