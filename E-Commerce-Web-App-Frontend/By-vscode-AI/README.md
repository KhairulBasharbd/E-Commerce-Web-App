# MVP E-Commerce Frontend (Next.js)

This project is a Next.js (App Router) frontend for your Java Spring Boot e-commerce backend.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Client-side state with React Context (`AuthProvider`, `CartProvider`)
- Service layer for backend integration

## Frontend Architecture

`src/app` contains routes and page-level composition.

`src/components` contains UI building blocks and feature components:
- `layout/` for app shell
- `product/` for product cards
- `cart/` for cart row UI
- `ui/` for reusable form/button controls

`src/context` contains global state:
- `auth-context.tsx`
- `cart-context.tsx`

`src/services` contains API access modules:
- `auth.service.ts`
- `product.service.ts`
- `cart.service.ts`
- `order.service.ts`

`src/lib` contains shared utilities:
- `config.ts` environment configuration
- `http-client.ts` typed request wrapper
- `token-storage.ts` client token persistence

`src/types/api.ts` contains API contract types for frontend usage.

## Environment

1. Copy `.env.example` to `.env.local`
2. Set values to match your backend routes

Default values:

- `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080`
- `NEXT_PUBLIC_AUTH_PREFIX=/api/auth`
- `NEXT_PUBLIC_PRODUCTS_PREFIX=/api/products`
- `NEXT_PUBLIC_CART_PREFIX=/api/cart`
- `NEXT_PUBLIC_ORDERS_PREFIX=/api/orders`
- `NEXT_PUBLIC_PAYMENTS_PREFIX=/api/payments`

## Run

Install dependencies and start development server:

- `npm install`
- `npm run dev`

Open `http://localhost:3000`.

## Current Pages

- `/` product listing and search
- `/products/[id]` product details
- `/login` login
- `/register` registration
- `/cart` cart management
- `/checkout` place order
- `/orders` order history

## Notes

- The frontend is wired to common endpoint conventions from your backend controller names.
- If any endpoint path differs in your backend implementation, update `.env.local` prefixes or the service methods in `src/services`.
