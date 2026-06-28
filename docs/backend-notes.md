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

# Database Layer

## Why PostgreSQL?

The initial implementation stored notifications in an in-memory array.

Limitation:

- Data disappeared whenever the server restarted.

Solution:

- Store notifications in PostgreSQL.

---

## Prisma ORM

Prisma acts as a bridge between NestJS and PostgreSQL.

Architecture:

```text
Controller
     │
Service
     │
Prisma ORM
     │
PostgreSQL
```

Instead of writing SQL manually:

```sql
SELECT * FROM Notification;
```

Prisma provides:

```ts
prisma.notification.findMany();
```

---

## Notification Model

Created inside `schema.prisma`.

Fields:

- id
- recipient
- channel
- message
- status
- createdAt

Migration:

```bash
npx prisma migrate dev --name init_notifications
```

---

## CRUD using Prisma

Replaced in-memory array operations with Prisma methods.

| Operation | Prisma Method                      |
| --------- | ---------------------------------- |
| Create    | `prisma.notification.create()`     |
| Read All  | `prisma.notification.findMany()`   |
| Read One  | `prisma.notification.findUnique()` |
| Update    | `prisma.notification.update()`     |
| Delete    | `prisma.notification.delete()`     |

---

## Complete CRUD API

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | `/notifications`     |
| GET    | `/notifications`     |
| GET    | `/notifications/:id` |
| PATCH  | `/notifications/:id` |
| DELETE | `/notifications/:id` |

---

## Debugging Lesson

Issue:

Prisma CLI connected successfully, but the NestJS application returned:

```text
ECONNREFUSED
```

Root Cause:

The NestJS application was not loading environment variables from `.env`.

Solution:

Installed `dotenv` and imported:

```ts
import "dotenv/config";
```

at the top of `main.ts`.

Result:

The application successfully connected to Neon PostgreSQL and all CRUD operations worked correctly.

# Redis & BullMQ

## Why Queue?

Sending notifications (Email, SMS, Push) can take time.

Instead of making the client wait until the notification is delivered, the API immediately stores the notification and pushes a job to a queue.

Benefits:

- Faster API response
- Better scalability
- Retry support
- Background processing
- Improved reliability

---

## Architecture

```text
Client
   │
POST /notifications
   │
   ▼
NestJS API
   │
   ├──────────────► PostgreSQL
   │                    │
   │                    ▼
   │              Status = PENDING
   │
   ▼
Redis Queue
   │
   ▼
BullMQ Worker
   │
   ▼
Process Notification
   │
   ▼
Update PostgreSQL
Status = DELIVERED
```

---

## Redis

Redis is an in-memory data store.

Used for:

- Queues
- Cache
- Sessions
- Rate limiting

Redis stores jobs temporarily until a worker processes them.

---

## BullMQ

BullMQ is a queue library built on top of Redis.

Responsibilities:

- Add jobs to queue
- Process jobs
- Retry failed jobs
- Delay jobs
- Schedule jobs

---

## Notification Queue

Created:

```text
src/queues/notification.queue.ts
```

Queue Name:

```text
notifications
```

Each POST request adds a job containing:

```text
notificationId
```

to the Redis queue.

---

## Worker

Created:

```text
src/queues/notification.worker.ts
```

Responsibilities:

1. Read jobs from Redis.
2. Process notifications.
3. Update PostgreSQL status.

Current implementation:

```text
PENDING
    │
Worker
    │
DELIVERED
```

Future implementation:

```text
PENDING
    │
Send Email (Resend)
    │
 ┌───────┴────────┐
 │                │
Success        Failure
 │                │
 ▼                ▼
DELIVERED      FAILED
```

---

## Background Processing

API request lifecycle:

```text
POST /notifications
        │
        ▼
Store in PostgreSQL
        │
Status = PENDING
        │
        ▼
Add Job to Redis
        │
Return Response (200 OK)
```

Worker lifecycle:

```text
Redis Queue
      │
      ▼
Worker
      │
      ▼
Process Notification
      │
      ▼
Update Status
```

This separates request handling from long-running tasks and improves system scalability.

# Email Delivery using Resend

## Objective

Upgrade the notification worker from simulating notification delivery to sending real email notifications.

## Processing Flow

```text
Redis Queue
      │
      ▼
BullMQ Worker
      │
      ▼
Retrieve Notification from PostgreSQL
      │
      ▼
Send Email using Resend
      │
      ▼
Update Notification Status
```

## Notification Status Lifecycle

```text
PENDING
    │
Worker Processes Job
    │
 ┌──┴──────────┐
 │             │
Success      Failure
 │             │
 ▼             ▼
DELIVERED    FAILED
```

- **PENDING** – Notification stored in PostgreSQL and waiting in the Redis queue.
- **DELIVERED** – Email successfully sent through Resend.
- **FAILED** – Email sending failed due to an exception or API error.

## End-to-End Architecture

```text
Client
   │
POST /notifications
   │
   ▼
NestJS API
   │
   ├────────────► PostgreSQL
   │                  │
   │                  ▼
   │            Status = PENDING
   │
   ▼
Redis Queue
   │
   ▼
BullMQ Worker
   │
   ▼
Resend Email API
   │
   ▼
Recipient Inbox
   │
   ▼
Update PostgreSQL Status
```

## Outcome

The notification service now supports real asynchronous email delivery. Notifications are stored in PostgreSQL, queued using Redis, processed by BullMQ workers, delivered through Resend, and their delivery status is updated automatically.

# Scheduled Notification Processing

## Overview

The notification service now supports delayed delivery using BullMQ.

### Processing Flow

```text
Client
   │
POST /notifications
   │
   ▼
Store Notification (PENDING)
   │
Calculate Delay
   │
   ▼
BullMQ Delayed Job
   │
Wait until scheduledAt
   │
   ▼
Worker Executes
   │
Send Email
   │
Update Status → DELIVERED
```

## Retry Strategy

Each queued notification is configured with:

- Maximum Attempts: 3
- Exponential Backoff
- Initial Delay: 5 seconds
- Failed jobs retained for debugging
- Successful jobs automatically removed

Notifications remain in the **PENDING** state while retries are in progress and transition to **FAILED** only after the final retry attempt.
