# Backend Notes

## NestJS Architecture

```
Request
    │
    ▼
Controller
    │
    ▼
Service
    │
    ▼
Response
```

### main.ts

Starts the NestJS application.

### module.ts

Registers controllers and services.

### controller.ts

- Receives HTTP requests
- Defines API endpoints
- Calls service methods

### service.ts

Contains business logic.

---

# Notifications Module

Created:

```text
src/
└── notifications/
    ├── dto/
    │   └── create-notification.dto.ts
    ├── notifications.controller.ts
    ├── notifications.service.ts
    └── notifications.module.ts
```

---

# REST API Endpoints

| Method | Endpoint             | Description                   |
| ------ | -------------------- | ----------------------------- |
| GET    | `/notifications`     | Retrieve all notifications    |
| GET    | `/notifications/:id` | Retrieve a notification by ID |
| POST   | `/notifications`     | Create a notification         |
| DELETE | `/notifications/:id` | Delete a notification         |

---

# DTO (Data Transfer Object)

Purpose:

Validate incoming request data before it reaches the business logic.

Installed packages:

```bash
npm install class-validator class-transformer
```

Global validation:

```ts
ValidationPipe;
```

Rules:

- recipient → valid email
- channel → EMAIL or SMS
- message → string

Invalid requests automatically return:

```text
400 Bad Request
```

---

# Current Storage

Notifications are currently stored inside an in-memory array.

Current architecture:

```
Browser / Client
        │
        ▼
Controller
        │
        ▼
Service
        │
        ▼
In-Memory Array
```

Limitation:

Stopping the server clears all notifications.

---

# Next Goal

Replace in-memory storage with PostgreSQL using Prisma ORM.

Target architecture:

```
Browser
     │
     ▼
Controller
     │
     ▼
Service
     │
     ▼
Prisma ORM
     │
     ▼
PostgreSQL
```

## Prisma & PostgreSQL

Purpose:
Replace temporary in-memory storage with a persistent PostgreSQL database.

### Prisma ORM

Prisma acts as an Object Relational Mapper (ORM) between the NestJS backend and PostgreSQL.

Flow:

```text
NestJS
   │
Prisma ORM
   │
PostgreSQL
```

Instead of writing raw SQL queries, Prisma provides a type-safe client for interacting with the database.

---

### Notification Model

Created a `Notification` model in `schema.prisma`.

Fields:

- id
- recipient
- channel
- message
- status
- createdAt

---

### Migration

Command:

```bash
npx prisma migrate dev --name init_notifications
```

Purpose:

- Generate SQL migration.
- Create database tables.
- Synchronize PostgreSQL schema with Prisma schema.

Result:

The `Notification` table was successfully created in the Neon PostgreSQL database.

## Debugging Lesson

Problem:
Prisma CLI connected successfully, but NestJS returned ECONNREFUSED.

Root Cause:
NestJS was not loading environment variables from `.env`.

Solution:
Installed `dotenv` and imported:

```ts
import "dotenv/config";
```
