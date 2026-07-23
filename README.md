# 🏢 Customer Management System — RESTful API

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0-red.svg)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.0-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED.svg)](https://www.docker.com/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI--3.0-green.svg)](https://swagger.io/)
[![Scalar](https://img.shields.io/badge/Scalar-API--Reference-purple.svg)](https://scalar.com/)

> **Back-End API Development Challenge (Option 3)**  
> A production-grade RESTful API built for a **Customer Management System (CMS)** featuring complete CRUD operations, multi-value field management (multiple mobile numbers, addresses), document storage (NID, Tax Certificate, Photo, Signature), paginated list filtering/sorting/search, structured error handling, and containerized Docker setup.

---

## 📑 Table of Contents

1. [Project Overview](#-project-overview)
2. [Technology Stack](#-technology-stack)
3. [Architecture & Design](#-architecture--design)
4. [Database Schema](#-database-schema)
5. [API Endpoints & Documentation](#-api-endpoints--documentation)
6. [Quick Start & Running with Docker](#-quick-start--running-with-docker)
7. [Local Development Setup](#-local-development-setup)
8. [Validation & Error Handling](#-validation--error-handling)
9. [AI Tools Usage Documentation](#-ai-tools-usage-documentation)
10. [Assumptions](#-assumptions)

---

## 🚀 Project Overview

The Customer Management System (CMS) REST API provides secure, reliable management of customer profiles and documents. It strictly adheres to standard REST conventions and NestJS layered architectural patterns (Controller → Service → Repository).

### Key Features
- 👤 **Complete Customer CRUD**: Create, read, partial update, and soft-delete customer profiles.
- 📱 **Multi-Value Relations**: Support for multiple phone numbers (`primary`, `alternate`, `office`) and addresses (`present`, `permanent`, `mailing`).
- 📁 **Document Management**: File upload API supporting NID, Tax Certificate, Photo, and Signature (JPEG, PNG, PDF up to 5MB) with local filesystem storage and database metadata tracking.
- 🔍 **Advanced List Querying**: Search by customer name, filter by status (`active`, `inactive`, `blocked`), sort by custom fields, and page through results.
- 🛡️ **Strict Input Validation**: Enforces unique checks on Email, Mobile Number, and National ID (NID), as well as business rules like non-future Date of Birth.
- 📖 **Interactive API Documentation**: Live **Swagger UI** (`/api/docs`) and **Scalar API Reference** (`/api/scalar`).
- 🐳 **One-Command Docker Deployment**: Ready to run anywhere using `docker compose up`.

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | [NestJS v11](https://nestjs.com/) | Modular, decorator-based TypeScript framework enforcing clean architecture |
| **Runtime** | [Node.js v20 LTS](https://nodejs.org/) / [Bun](https://bun.sh/) | High-performance asynchronous execution |
| **Language** | [TypeScript v5.7](https://www.typescriptlang.org/) | Type safety, maintainability, and declarative decorator support |
| **Database** | [PostgreSQL 16](https://www.postgresql.org/) | ACID-compliant relational database with strong constraint capabilities |
| **ORM** | [TypeORM v1.1](https://typeorm.io/) | Repository pattern, relational mapping, and transactional support |
| **Validation** | `class-validator` & `class-transformer` | Declarative DTO schema validation and payload stripping |
| **Documentation** | `@nestjs/swagger` & `@scalar/nestjs-api-reference` | Auto-generated OpenAPI v3 UI and modern Scalar documentation |
| **Containerization**| [Docker](https://www.docker.com/) & Docker Compose | Containerized application and database setup |

---

## 📐 Architecture & Design

The solution follows a strict **Layered Architecture**:

```
┌──────────────────────────────────────────────────────────┐
│                      HTTP Request                        │
└────────────────────────────┬─────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────┐
│                 Global Middleware & Pipes                │
│  • ValidationPipe  • AllExceptionsFilter  • Interceptor  │
└────────────────────────────┬─────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────┐
│                     Controller Layer                     │
│    CustomersController       │     DocumentsController   │
└────────────────────────────┬─────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────┐
│                      Service Layer                       │
│    CustomersService          │     DocumentsService      │
└────────────────────────────┬─────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────┐
│                    Repository Layer                      │
│    CustomersRepository       │     DocumentsRepository   │
└────────────────────────────┬─────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────┐
│                     PostgreSQL 16                        │
└──────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

The database consists of **4 relational tables**:

```
┌──────────────────────────┐
│        customers         │
├──────────────────────────┤
│ id           UUID PK     │
│ name         VARCHAR(255)│
│ email        VARCHAR UQ  │
│ nid_number   VARCHAR UQ  │
│ date_of_birth DATE       │
│ status       ENUM        │
│ created_at   TIMESTAMP   │
│ updated_at   TIMESTAMP   │
└────────────┬─────────────┘
             │
   ┌─────────┼──────────────────┐
   │ 1       │ 1                │ 1
   │ N       │ N                │ N
┌──▼─────────┴───────┐  ┌───────▼──────────────┐  ┌▼──────────────────┐
│   phone_numbers    │  │      addresses       │  │     documents     │
├────────────────────┤  ├──────────────────────┤  ├───────────────────┤
│ id        UUID PK  │  │ id        UUID PK    │  │ id       UUID PK  │
│ customer_id FK     │  │ customer_id FK       │  │ customer_id FK    │
│ number    VARCHAR  │  │ type      ENUM       │  │ type     ENUM     │
│ type      ENUM     │  │ line1, line2 VARCHAR │  │ file_name VARCHAR │
│ is_primary BOOLEAN │  │ city, state  VARCHAR │  │ file_path VARCHAR │
└────────────────────┘  │ zip, country VARCHAR │  │ file_size INT     │
                        └──────────────────────┘  │ mime_type VARCHAR │
                                                  └───────────────────┘
```

---

## 🌐 API Endpoints & Documentation

### Customer Management

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `POST` | `/api/v1/customers` | Create a new customer profile | `201`, `400`, `409` |
| `GET` | `/api/v1/customers` | List customers (supports page, limit, search, status, sortBy, sortOrder) | `200`, `400` |
| `GET` | `/api/v1/customers/:id` | Get customer details by UUID | `200`, `404` |
| `PATCH` | `/api/v1/customers/:id` | Partially update customer profile | `200`, `400`, `404`, `409` |
| `DELETE` | `/api/v1/customers/:id` | Soft delete customer (sets status to `inactive`) | `200`, `404` |

### Document Management

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `POST` | `/api/v1/customers/:customerId/documents` | Upload customer document (NID, Tax Cert, Photo, Signature) | `201`, `400`, `404` |
| `GET` | `/api/v1/customers/:customerId/documents` | List uploaded document metadata for a customer | `200`, `404` |
| `GET` | `/api/v1/customers/:customerId/documents/:docId` | Stream / Download document file | `200`, `404` |
| `DELETE` | `/api/v1/customers/:customerId/documents/:docId` | Delete document file from disk & DB metadata | `200`, `404` |

### Documentation Interactive UIs
When the application is running, open your browser to access:
- 📖 **Swagger UI**: `http://localhost:4001/api/docs`
- 🎨 **Scalar API Reference**: `http://localhost:4001/api/scalar`

---

## 🐳 Quick Start & Running with Docker

Running the application using **Docker Compose** requires **zero local software dependencies** (no Node.js or PostgreSQL needed on your machine).

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/rahulxiao/Backed-idlc.git
   cd Backed-idlc
   ```

2. **Copy Environment File**:
   ```bash
   cp .env.example .env
   ```

3. **Build and Run Containers**:
   ```bash
   docker compose up --build
   ```

4. **Verify Application**:
   - API Base URL: `http://localhost:4001/api/v1`
   - Swagger Documentation: `http://localhost:4001/api/docs`
   - Scalar Documentation: `http://localhost:4001/api/scalar`

5. **Stop Containers**:
   ```bash
   docker compose down
   ```

---

## 💻 Local Development Setup

If you prefer running the application directly on your workstation:

### Prerequisites
- Node.js (v20 LTS) or Bun (v1.1+)
- PostgreSQL server running locally

### Steps

1. **Install Dependencies**:
   ```bash
   pnpm install
   # or using bun
   bun install
   ```

2. **Configure Environment Variables**:
   Create a `.env` file from `.env.example` and update database credentials:
   ```env
   PORT=4001
   API_PREFIX=api/v1
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=cms_db
   DB_SYNC=true
   ```

3. **Start Development Server**:
   ```bash
   pnpm run start:dev
   # or
   bun run start:dev
   ```

---

## 🛡️ Validation & Error Handling

### Validation Rules
- **Customer Name**: Required, minimum 2 characters.
- **Email Address**: Required, valid email format, unique in database.
- **Mobile Number**: Required, unique in database.
- **National ID (NID)**: Required, unique in database.
- **Date of Birth**: Cannot be a future date (`@IsNotFutureDate()` custom constraint).
- **Document Upload**: Allowed file extensions are `.jpg`, `.jpeg`, `.png`, `.pdf` up to a maximum size of `5 MB`.

### Error Response Standard
All API errors return a uniform structure:
```json
{
  "success": false,
  "statusCode": 409,
  "message": "A record with this email already exists",
  "error": "ConflictException",
  "timestamp": "2026-07-23T20:00:00.000Z",
  "path": "/api/v1/customers"
}
```

---

## 🤖 AI Tools Usage Documentation

### AI Tools Utilized
- **Antigravity (Google DeepMind)**: Architecture planning, code generation, entity relational mapping, and OpenAPI documentation design.

### How AI-Generated Code Was Verified
1. **Manual Inspection**: Reviewed all generated DTO validation rules, TypeORM relation options, and HTTP status codes against challenge specifications.
2. **Type Safety & Compilation**: Verified that the TypeScript compiler passed with zero errors (`npx nest build`).
3. **Database Constraints Test**: Verified that duplicate `email`, `nidNumber`, and `phoneNumber` insertions were properly caught by the `AllExceptionsFilter` and returned HTTP `409 Conflict`.
4. **Containerization Test**: Validated that `docker compose up --build` executed multi-stage builds cleanly and established container networking between Node.js and PostgreSQL 16.

---

## 📌 Assumptions

1. **Soft Deletion**: Calling `DELETE /api/v1/customers/:id` updates customer status to `inactive` rather than hard deleting database rows to preserve audit history.
2. **File Storage**: Uploaded files are stored in the `./uploads/documents` directory on local/container storage, while document metadata is stored in PostgreSQL.
3. **Authentication**: Authentication/Authorization was omitted per project scope requirements to focus on back-end API architecture, CRUD capabilities, and document upload functionality.
