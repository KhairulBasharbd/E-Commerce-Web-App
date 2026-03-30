// ──────────────────────────────────────────────
// Auth
// ──────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export type Role = 'CUSTOMER' | 'ADMIN';

export interface AuthUser {
  email: string;
  role: Role;
  token: string;
}

// ──────────────────────────────────────────────
// Products
// ──────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  active: boolean;
  createdAt: string;
}

export interface ProductPage {
  content: Product[];
  totalPages: number;
  totalElements: number;
  number: number; // current page (0-indexed)
  size: number;
}

export interface ProductFilters {
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  name?: string;
  active?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

export interface ProductAdminRequest {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  active: boolean;
}

// ──────────────────────────────────────────────
// Cart
// ──────────────────────────────────────────────
export interface CartItemResponse {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface CartResponse {
  id: string;
  userId: string;
  items: CartItemResponse[];
}

export interface CartItemRequest {
  productId: string;
  quantity: number;
}

// ──────────────────────────────────────────────
// Orders
// ──────────────────────────────────────────────
export interface OrderItemResponse {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'CREATED' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED';

export interface OrderResponse {
  id: string;
  userId: string;
  items: OrderItemResponse[];
  totalPrice: number;
  status: OrderStatus;
}

// ──────────────────────────────────────────────
// API Error
// ──────────────────────────────────────────────
export interface ApiError {
  message: string;
  status?: number;
}
