# Inventory Management API — NestJS

Phiên bản NestJS của REST API quản lý tồn kho, tương thích endpoint với Express (`src/`).

## Kiến trúc

```
src/
├── main.ts                 # Bootstrap ứng dụng với graceful shutdown
├── app.module.ts           # Root module
├── config/                 # Cấu hình môi trường (@nestjs/config)
├── common/                 # Exception, pipe, interceptor dùng chung
│   ├── exceptions/         # Custom AppException
│   ├── filters/            # AllExceptionsFilter
│   ├── interceptors/       # ApiResponseInterceptor
│   ├── interfaces/         # TypeScript interfaces
│   ├── pipes/              # ZodValidationPipe
│   └── utils/              # Helper utilities (pagination, number-to-words)
├── database/               # PostgreSQL pool & migration
│   ├── database.module.ts
│   ├── database.service.ts # Global service với transaction support
│   └── migrate.ts          # Database migration script
├── health/                 # Health check endpoint
└── modules/                # Domain modules (Controller → Service → Repository)
    ├── warehouse/
    ├── unit/
    ├── division/
    ├── product/
    └── goods-received-note/
```

Mỗi module gồm:
- **Controller**: HTTP layer, validation Zod, decorators
- **Service**: business logic, error handling
- **Repository**: truy vấn PostgreSQL với transaction support
- **dto/**: Zod schemas cho validation
- **entities/**: TypeScript interfaces

## Tính năng

- ✅ RESTful API với NestJS framework
- ✅ PostgreSQL với connection pool
- ✅ Transaction support cho complex operations
- ✅ Zod validation cho request/response
- ✅ Global error handling với custom exceptions
- ✅ API response interceptor cho consistent response format
- ✅ Pagination helper utility
- ✅ Number to Vietnamese words converter
- ✅ Graceful shutdown
- ✅ Static file serving
- ✅ Health check endpoint
- ✅ Clean code architecture với separation of concerns

## Cài đặt & chạy

```bash
cd nestjs
cp .env.example .env
# Chỉnh sửa .env với cấu hình PostgreSQL của bạn
npm install
npm run migrate
npm run start:dev
```

API chạy tại `http://localhost:3001/api`.

## Scripts

| Script | Mô tả |
|--------|-------|
| `npm run start:dev` | Chạy dev với hot reload |
| `npm run build` | Build production |
| `npm run start:prod` | Chạy bản build |
| `npm run migrate` | Chạy SQL migrations |
| `npm test` | Chạy unit tests |
| `npm run test:watch` | Chạy tests với watch mode |

## Response format

Giống Express:

```json
{ "success": true, "data": { ... } }
{ "success": true, "data": [...], "pagination": { ... } }
{ "success": false, "error": { "code": "...", "message": "..." } }
```

## Available Endpoints

### Health Check
- `GET /api/health`

### Goods Received Notes (Phiếu nhập kho)
- `GET /api/goods-received-notes`
- `POST /api/goods-received-notes`
- `GET /api/goods-received-notes/:id`
- `PUT /api/goods-received-notes/:id`
- `DELETE /api/goods-received-notes/:id`

### Danh mục
- `GET /api/warehouses`
- `GET /api/units`
- `GET /api/divisions`
- `GET /api/products`

## Clean Code Principles

- **Single Responsibility**: Mỗi class/module có một trách nhiệm rõ ràng
- **Dependency Injection**: Sử dụng DI của NestJS cho loose coupling
- **Separation of Concerns**: Controller → Service → Repository layers
- **DRY**: Reusable utilities và shared code
- **Type Safety**: TypeScript interfaces và Zod schemas
- **Error Handling**: Centralized exception handling
- **Validation**: Declarative validation với Zod
- **Transaction Management**: Atomic operations cho complex business logic
