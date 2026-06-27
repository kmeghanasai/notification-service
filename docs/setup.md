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
