# 🛒 E-Commerce Backend (Spring Boot MVP)

A production-ready E-Commerce backend built with Spring Boot 3.5.9, Java 21, and PostgreSQL, following Clean Architecture and industry best practices.

This project implements core e-commerce functionalities such as authentication, product catalog, cart, order processing, payment simulation, and admin management using JWT-based security.

## 📌 1. Project Title & Tagline

**E-Commerce Backend MVP**

Secure, scalable, and cleanly architected backend for an online shopping platform.

## 🚀 2. Features & Functionalities (MVP Scope)

### 🔐 Auth & User Module

- User registration (CUSTOMER)
- User login with JWT authentication
- Role-based authorization (CUSTOMER, ADMIN)
- Password encryption using BCrypt
- Stateless security using JWT

### 🛍 Product Catalog (Public + Admin)

- View all products (public)
- View product by ID
- Filtering:
  - minPrice / maxPrice
  - category
  - name (contains)
  - active status
- Pagination & sorting (price, createdAt)
- Implemented using JPA Specifications
- Admin-only:
  - Create product
  - Update product
  - Activate / deactivate product

### 🛒 Cart Module

- One active cart per user
- Add product to cart
- Update product quantity
- Remove product from cart
- View cart items
- Cart is user-specific and JWT-protected

### 📦 Order Module

- Place order from cart
- Automatically calculate total price
- Reduce product stock on order placement
- Order lifecycle:
  - CREATED
  - CONFIRMED
  - SHIPPED
  - DELIVERED
- Orders are linked to users

### 💳 Payment Module (Mock)

- Simulated payment processing
- Payment statuses:
  - PENDING
  - SUCCESS
  - FAILED
- Payment linked to order
- No external payment gateway (MVP scope)

### 👑 Admin Module

- Admin-only secured APIs
- Product management
- Role-based access using @PreAuthorize
- JWT contains role information

### 🧩 Cross-Cutting Features

- Clean Architecture (Controller → Service → Repository)
- DTO-based APIs (no entity exposure)
- Global exception handling
- Meaningful error responses
- Swagger / OpenAPI documentation
- UUID as primary keys
- Constructor-based dependency injection

## 🧰 3. Tech Stack

| Layer | Technology |
|-------|------------|
| Language | Java 21 |
| Framework | Spring Boot 3.5.9 |
| Build Tool | Maven |
| Database | PostgreSQL |
| ORM | Spring Data JPA / Hibernate |
| Security | Spring Security + JWT |
| Documentation | springdoc-openapi (Swagger UI) |
| Architecture | Monolithic, Clean Architecture |

## ✅ 4. Prerequisites

Make sure you have the following installed:

- Java 21
- Maven 3.9+
- PostgreSQL 14+
- Docker (optional, for DB)
- IDE (IntelliJ IDEA recommended)

## ⚡ 5. Getting Started / Quick Start

### 📥 Clone the repository
```bash
git clone https://github.com/your-username/E-Commerce-Web-App.git
cd E-Commerce-Web-App
```

### 🐘 Start PostgreSQL (Docker – Recommended)
- Run postgresql database from docker using `docker-compose.yml` file
```bash
docker compose up -d
```

### ▶️ Run the application
```bash
mvn clean spring-boot:run
```

Application will start at:
```
http://localhost:8080
```

## 📘 6. API Documentation (Swagger)

Swagger UI is enabled via springdoc-openapi.

👉 Swagger URL:
```
http://localhost:8080/swagger-ui.html
```

### 🔐 Using JWT in Swagger

1. Login via `/auth/login`
2. Copy JWT token
3. Click **Authorize** 🔒
4. Paste:
```
Bearer <your-jwt-token>
```

## 🗂 7. Project Structure
```
src/main/java/com/example/ecommerce
│
├── config                    # App & Swagger configuration
├── security                  # JWT, filters, security config
├── controller                # REST controllers
├── service                   # Service interfaces
├── service/impl              # Business logic implementations
├── repository                # JPA repositories
├── specification             # JPA Specifications (filtering)
├── dto
│   ├── request               # Request DTOs
│   └── response              # Response DTOs
├── entity                    # JPA entities
├── mapper                    # Entity ↔ DTO mappers
├── exception                 # Custom exceptions & handlers
└── EcommerceApplication.java
```

## ⚙️ 8. Environment Configuration

**application.yml** (Important values)
```yaml
spring:
  datasource:
    url: ${DB_URL:jdbc:postgresql://localhost:5432/ecommerce_db}
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:postgres}
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    open-in-view: false

jwt:
  ${jwt_key} :kekUJgI4idp1C2hgab4cwDcvB3y8xmwO3scdvByjCSE
  expiration: ${mili_seconds} :86400000
```

## 🐳 9. Docker Support (Database)

Only PostgreSQL is dockerized for MVP simplicity.
```bash
docker compose up -d
```

- You can run the postgresql database from docker image using `docker-compose.yml` file.
- If you already have local or cloud postgresql running, then you can add your DB credentials into `application.yml`.

## 🔮 10. Future Improvements

Planned enhancements beyond MVP:

- 🔄 Refresh token support
- 📦 Inventory reservation & rollback
- 💳 Real payment gateway integration (Stripe / SSLCommerz)
- 🧾 Invoice generation (PDF)
- 📊 Admin dashboards & analytics
- 🔍 Full-text search (Elasticsearch)
- 🧪 Unit & integration tests
- 🚀 CI/CD pipeline
- ☁️ Cloud deployment (AWS / GCP)

## 📝 Author Notes

This project is designed to:

- Follow real-world backend standards
- Be interview-ready
- Serve as a strong portfolio project
- Scale easily into microservices if needed
