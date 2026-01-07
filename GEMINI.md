# Freight Rate Calculator

## Project Overview

The Freight Rate Calculator is a comprehensive web application designed for trucking industry professionals to calculate accurate freight rates based on real-world operational costs. It features a sophisticated rate calculation engine, vehicle management, route planning, and a rewards system.

**Tech Stack:**
*   **Frontend:** Next.js 15 (App Router), Tailwind CSS v4, Lucide React.
*   **Backend:** Node.js with Express.js (located in `server/`), TypeScript.
*   **Database:** PostgreSQL with Prisma ORM.
*   **Authentication:** JWT with Access/Refresh tokens.
*   **Key Integrations:** PC*MILER, Google Maps, OpenWeatherMap, EIA, TollGuru, NHTSA, FMCSA.

## Architecture

*   **`app/`**: Next.js App Router pages and layouts.
    *   `(dashboard)/`: Protected routes for the main application.
    *   `auth/`: Authentication pages (Signin/Signup).
    *   `api/`: (Note: The main API logic seems to reside in the separate `server/` directory, but Next.js API routes might also be used or proxied).
*   **`server/`**: Standalone Express.js backend API.
    *   `src/services/`: Core business logic (Rate engine, Auth, etc.).
    *   `src/controllers/`: Request handlers.
    *   `src/routes/`: API route definitions.
*   **`components/`**: Reusable React components organized by feature (Calculator, Dashboard, Quote, etc.).
*   **`prisma/`**: Database schema (`schema.prisma`) and seed scripts.
*   **`lib/`**: Shared utilities and database clients.

## Key Features & Status

*   **Authentication:** Complete (JWT, Role-based).
*   **Rate Engine:** Complete (Variable/Fixed costs, Strategic adjustments).
*   **Vehicle Management:** Complete (CRUD, VIN decoding).
*   **Route Planning:** Complete (PC*MILER + Google Maps fallback).
*   **Quote Management:** Complete (History, PDF Export).
*   **Rewards:** Complete (Gamification).
*   **Testing:** Partial (Manual complete, Automated pending).

## Building and Running

**Prerequisites:**
*   Node.js
*   PostgreSQL Database
*   Environment variables (see `APPLICATION_DOCUMENTATION.md` for required keys)

**Development:**
*   **Run All (Frontend + Backend):** `npm run dev:all`
*   **Frontend Only:** `npm run dev` (http://localhost:3000)
*   **Backend Only:** `npm run dev:server`

**Database Management:**
*   **Generate Client:** `npx prisma generate`
*   **Run Migrations:** `npx prisma migrate dev`
*   **Seed Database:** `npm run db:seed`
*   **Open Prisma Studio:** `npx prisma studio`

**Build:**
*   **Frontend:** `npm run build`
*   **Backend:** `npm run build:server`

## Development Conventions

*   **Styling:** Tailwind CSS. Match existing design patterns in `components/`.
*   **State Management:** React `useState`/`useEffect` (no global state library like Redux).
*   **Backend Structure:** Service-Controller-Route pattern. Business logic belongs in `services/`.
*   **Database:** Always update `schema.prisma` and run migrations for data model changes.
*   **Validation:** Zod is used for schema validation (auth, API inputs).

## Documentation

*   **`APPLICATION_DOCUMENTATION.md`**: Detailed feature breakdown, formulas, and architectural decisions. **Consult this first for logic questions.**
*   **`prisma/schema.prisma`**: The source of truth for the data model.
*   **`server/README.md`** (if exists) or `BACKEND_TICKETS.md`: Backend specific details.
