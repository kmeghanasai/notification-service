<!-- # Installation - Setup

## Install Node.js

Purpose:
Node.js provides the JavaScript runtime required to run and manage the frontend (Next.js), backend (NestJS), package installation (npm), and project tooling.

Install Node.js (LTS version).

Verify installation:

Restart VS Code / PowerShell after installation (environment variable changes may not reflect immediately).

```bash
node -v
npm -v
```

Expected:
Commands should print the installed version numbers.

---

## Create Turborepo

Purpose:
Initialize a monorepo to manage frontend, backend, and shared packages in a single codebase with easier development and scalability.

Command:

```bash
npx create-turbo@latest .
```

Selected:

- Package manager: npm

### Run Turborepo

Command:

```bash
npm run dev
```

Purpose:
Run applications inside the monorepo in development mode.

Result:
Successfully launched generated Next.js application locally.

Local URL:

```text
http://localhost:<port_number>
```

## Configure Remote Repository

Purpose:
Connect local Git repository to GitHub for version control and backup.

Create a repository and then do the following:
Commands:

```bash
git remote add origin <repo-url>
git branch -M main
git push -u origin main
```

If changes are made later:

git add .
git commit -m "<message>"
git push

Note:
Run git add . while standing in the root folder (notification-service/) so all project changes are tracked.

apps → things that RUN
packages → things that are SHARED
monorepo → everything in ONE place

## Install NestJS

Purpose:
Set up the backend application to build APIs and business logic.

Commands:

```bash
npm install -g @nestjs/cli
nest new .
```

Verification:

```bash
npm run start:dev
```

Starts at port_number 3000.

Expected:
Backend starts successfully and opens locally.

apps/api
main.ts -> starts the application
module.ts -> connects everything
controller.ts -> receives requests/ handles routes
service.ts -> business logic, executes logic

### Error — Nested Git Repository

Error:
Reason(coz we ran "nest new .")

```text
apps/api does not have a commit checked out
```

Cause:
NestJS initialized a separate Git repository inside `apps/api`.

Fix:

```bash
Remove-Item -Recurse -Force .\apps\api\.git
```

Result:
Managed backend inside the parent monorepo repository. -->

# Installation & Setup

## 1. Install Node.js

Purpose:
Node.js provides the JavaScript runtime required for the frontend (Next.js), backend (NestJS), npm package management, and project tooling.

Verify installation:

```bash
node -v
npm -v
```

Expected:
Both commands should print installed version numbers.

> Restart VS Code / PowerShell after installation so PATH changes are applied.

---

## 2. Create Turborepo

Purpose:
Initialize a monorepo to manage frontend, backend, and shared packages in a single repository.

Command:

```bash
npx create-turbo@latest .
```

Selected:

- Package Manager: npm

Run:

```bash
npm run dev
```

Expected:
The generated Next.js application starts successfully.

---

## 3. Configure GitHub Repository

Purpose:
Connect the local repository to GitHub.

Commands:

```bash
git remote add origin <repository-url>
git branch -M main
git push -u origin main
```

Future workflow:

```bash
git add .
git commit -m "<message>"
git push
```

> Always run Git commands from the project root (`notification-service/`).

---

## 4. Install NestJS

Purpose:
Create the backend application.

Commands:

```bash
npm install -g @nestjs/cli
nest new .
```

Verify:

```bash
npm run start:dev
```

Expected:

Backend starts successfully on:

```text
http://localhost:3000
```

---

## 5. Nested Git Repository Issue

Error:

```text
apps/api does not have a commit checked out
```

Cause:

Running `nest new .` initializes another Git repository inside `apps/api`.

Fix:

```bash
Remove-Item -Recurse -Force .\apps\api\.git
```

Result:

The backend is now managed by the parent monorepo repository.

---

## 6. Install Prisma

Purpose:
Prisma acts as the ORM between the NestJS backend and PostgreSQL database.

Commands:

```bash
npm install prisma --save-dev
npm install @prisma/client

npx prisma init
```

Expected:

```text
prisma/
.env
schema.prisma
prisma.config.ts
```

## Configure PostgreSQL with Prisma

Purpose:

Persist notifications in a PostgreSQL database instead of in-memory storage.

### Install Prisma

```bash
npm install prisma --save-dev
npm install @prisma/client
```

Initialize Prisma:

```bash
npx prisma init
```

### Create Migration

```bash
npx prisma migrate dev --name init_notifications
```

Generate Prisma Client:

```bash
npx prisma generate
```

### Install PostgreSQL Driver (Prisma 7)

```bash
npm install @prisma/adapter-pg pg dotenv
npm install -D @types/pg
```

### Environment Variables

Create `.env` inside `apps/api`.

```env
DATABASE_URL="<Neon PostgreSQL connection string>"
```

### Important Note

NestJS does **not** automatically load `.env`.

Add at the top of `src/main.ts`:

```ts
import "dotenv/config";
```

This makes `process.env.DATABASE_URL` available to Prisma.

## Configure Redis Queue (Upstash)

Purpose:

Integrate a cloud-hosted Redis instance for asynchronous background processing.

---

### Create Upstash Redis

1. Create a free Redis database on Upstash.
2. Select the nearest available region.
3. Copy the Redis TCP connection string.

---

### Environment Variable

Add the Redis connection string to:

```text
apps/api/.env
```

```env
REDIS_URL="<Upstash Redis connection string>"
```

---

### Install Dependencies

```bash
npm install bullmq ioredis
```

Purpose:

- **BullMQ** – Queue management library.
- **ioredis** – Redis client.

---

### Create Queue

Created:

```text
src/queues/notification.queue.ts
```

Queue Name:

```text
notifications
```

This queue receives notification jobs from the API.

---

### Create Worker

Created:

```text
src/queues/notification.worker.ts
```

Run worker separately:

```bash
npm run worker:notifications
```

Purpose:

- Listen for new jobs.
- Process notifications in the background.
- Update notification status after processing.

---

### Add Worker Script

Inside `package.json`:

```json
"worker:notifications": "ts-node src/queues/notification.worker.ts"
```

---

### Development Workflow

Terminal 1:

```bash
npm run start:dev
```

Runs the NestJS backend.

Terminal 2:

```bash
npm run worker:notifications
```

Runs the BullMQ worker.

---

### Current Notification Flow

```text
POST /notifications
        │
        ▼
Store in PostgreSQL
(Status = PENDING)
        │
        ▼
Push Job to Redis Queue
        │
        ▼
Worker Processes Job
        │
        ▼
Update Status → DELIVERED
```

Result:

Notifications are processed asynchronously without blocking API responses.

## Configure Email Delivery with Resend

Purpose:

Enable the background worker to send real email notifications after processing queued jobs.

### Create Resend Account

- Create a Resend account.
- Generate an API Key.

### Environment Variable

Add the following to `apps/api/.env`:

```env
RESEND_API_KEY="<your_resend_api_key>"
```

### Install Dependency

```bash
npm install resend
```

### Development Sender

For development, Resend's default sender was used:

```text
onboarding@resend.dev
```

### Email Notification Flow

```text
POST /notifications
        │
        ▼
Store notification in PostgreSQL
        │
Status = PENDING
        │
        ▼
Push job to Redis Queue
        │
        ▼
BullMQ Worker
        │
        ▼
Send email using Resend
        │
        ▼
Update status = DELIVERED
```

### Run the Application

Backend:

```bash
npm run start:dev
```

Worker:

```bash
npm run worker:notifications
```

## Scheduled Notifications

### Database Update

Added a new optional field to the `Notification` model:

```text
scheduledAt DateTime?
```

Run the migration after updating the Prisma schema:

```bash
npx prisma migrate dev --name add_scheduled_notifications
```

### API Request

Notifications can now be scheduled by providing an optional `scheduledAt` field in ISO-8601 format.

Example:

```json
{
  "recipient": "user@example.com",
  "channel": "EMAIL",
  "message": "Scheduled notification",
  "scheduledAt": "2026-06-28T12:30:00.000Z"
}
```

If `scheduledAt` is omitted, the notification is processed immediately.
