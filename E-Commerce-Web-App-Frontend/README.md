# 🛒 E-Commerce Frontend (Next.js 16 + Tailwind CSS 4)

A modern, responsive, and performance-optimized E-Commerce frontend built with **Next.js 16**, **React 19**, and **Tailwind CSS 4**. This application provides a seamless shopping experience, robust authentication, and a full-featured admin management dashboard.

---

## 📌 1. Project Title & Tagline

**E-Commerce Frontend MVP**

Secure, lightning-fast, and cleanly designed user interface for a modern online shopping platform.

---

## 🚀 2. Features & Functionalities (MVP Scope)

### 🔐 Auth & User Module
- **User Registration**: Create a new account as a CUSTOMER.
- **JWT Login**: Secure authentication with persistent session management.
- **Auth Guard**: Middleware-protected routes to prevent unauthorized access.
- **Client-Side Validation**: Immediate feedback on login/register forms.

### 🛍 Product Catalog (Public + Admin)
- **Dynamic Browsing**: Grid view of all active products.
- **Advanced Filtering**:
  - Filter by Category
  - Filter by Price Range (Min/Max)
  - Search by Name (Partial match)
- **Paginated Results**: Smooth navigation through large catalogs.
- **Mobile Responsive**: Optimised view for all device sizes.

### 🛒 Cart Module
- **Real-Time Updates**: Add, remove, and adjust quantities in the cart.
- **Persistent State**: Cart contents are managed through React Context.
- **Subtotal Calculation**: Automatic price calculation before checkout.
- **Inventory Check**: Error handling for out-of-stock items.

### 📦 Order & Checkout Module
- **Streamlined Checkout**: One-click order placement from the cart.
- **Mock Payment Flow**: Simulated gateway integration to complete orders.
- **Order Confirmation**: Visual feedback upon successful order creation.

### 👑 Admin Module
- **Secured Dashboards**: Accessible only to users with the `ADMIN` role.
- **Product Management**:
  - Create new products with categories and IDs.
  - Edit existing product details.
  - Immediate catalog updates.

---

## 🧰 3. Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Library | [React 19](https://react.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Icons | [Lucide React](https://lucide.dev/) |
| State | React Context API |
| Networking | [Axios](https://axios-http.com/) |

---

## ✅ 4. Prerequisites

Before you begin, ensures you have the following installed:

- **Node.js**: 20.x or higher
- **pnpm**: 9.x or higher (Recommended for dependency isolation)
- **Backend API**: The [Spring Boot Backend](../README.md) should be running at `http://localhost:8081`.

---

## ⚡ 5. Getting Started / Quick Start

### 📥 Clone the repository
```bash
git clone https://github.com/your-username/E-Commerce-Web-App.git
cd E-Commerce-Web-App/E-Commerce-Web-App-Frontend
```

### ⚙️ Environment Setup
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8081
```

### 📦 Install Dependencies
```bash
pnpm install
```

### ▶️ Run the Development Server
```bash
pnpm dev
```
Application will be available at: **[http://localhost:3000](http://localhost:3000)**

---

## 🔌 6. Connecting to Backend API

The frontend communicates with the backend via a centralized Axios instance configured in `lib/api.ts`.

### 🔐 JWT Interceptors
- **Request Interceptor**: Automatically attaches the `Authorization: Bearer <token>` header to all requests if a token exists in `localStorage`.
- **Response Interceptor**: Automatically redirects to `/login` if any request returns a `401 Unauthorized` response.

---

## 🗂 7. Project Structure

```
E-Commerce-Web-App-Frontend/
├── app/                  # Next.js App Router
│   ├── (auth)/           # Authentication routes (Login, Register)
│   ├── (shop)/           # Public shopping routes (Cart, Products, Checkout)
│   ├── admin/            # Admin-only management routes
│   ├── layout.tsx        # Global layout and fonts
│   └── globals.css       # Tailwind 4 configuration
├── components/           # Reusable UI components
├── context/              # State management (Auth & Cart Context)
├── lib/                  # API clients (Axios) and utility functions
├── types/                # TypeScript interfaces for API models
├── middleware.ts         # Route protection and Auth rules
└── next.config.ts        # Next.js configuration
```

---

## ⚙️ 8. Environment Configuration

**.env.local** (Required for backend connection)
```bash
# URL of the Spring Boot Backend API
NEXT_PUBLIC_API_URL=http://localhost:8081
```

---

## 🐳 9. Docker Support (Coming Soon)

The frontend currently runs as a standalone Node.js process. Docker support for the frontend container is planned for the next release.

---

## 🔮 10. Future Improvements

- 🔄 **State Management**: Migration to TanStack Query for caching and sync.
- 🎨 **Component Library**: Transition to Radix UI or shadcn/ui components.
- 🧪 **Testing**: Unit tests with Vitest and E2E with Playwright.
- 🌙 **Dark Mode**: Native implementation using Tailwind 4 features.
- 🐳 **Dockerization**: Complete containerization for the entire frontend stack.

---

## 📝 Author Notes

This frontend is designed to:
- Be highly responsive and mobile-friendly.
- Follow modern React 19 standards and the Next.js App Router pattern.
- Integrate securely with JWT-based Spring Boot backends.
- Serve as a fast, clean starting point for any E-Commerce platform.
