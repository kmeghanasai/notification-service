# Installation - Setup

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
