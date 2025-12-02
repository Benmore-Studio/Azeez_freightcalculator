# Database Setup

This document covers database setup, migrations, and seeding for the Freight Calculator application.

## Prerequisites

- **PostgreSQL 14+** installed locally or access to a cloud PostgreSQL instance
- **Node.js 18+** for running Prisma commands

## Quick Start

### 1. Configure Database Connection

Edit `.env` file with your PostgreSQL connection string:

```bash
# Local development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/freight_calculator?schema=public"

# Production (example with Neon, Supabase, etc.)
DATABASE_URL="postgresql://user:password@your-host.com:5432/freight_calculator?schema=public&sslmode=require"
```

### 2. Create Database

```bash
# Using psql
createdb freight_calculator

# Or via psql prompt
psql -U postgres
CREATE DATABASE freight_calculator;
```

### 3. Run Migrations

```bash
# Development (creates migration + applies it)
npm run db:migrate

# Production (applies existing migrations)
npm run db:migrate:prod

# Push schema without migration history (development only)
npm run db:push
```

### 4. Seed the Database

```bash
npm run db:seed
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Create and run migrations (dev) |
| `npm run db:migrate:prod` | Deploy migrations (production) |
| `npm run db:push` | Push schema changes directly (dev) |
| `npm run db:seed` | Seed database with test data |
| `npm run db:reset` | Reset database and re-run migrations + seed |
| `npm run db:studio` | Open Prisma Studio (visual database browser) |

## Migration Workflow

### Development

```bash
# 1. Make changes to prisma/schema.prisma
# 2. Create and apply migration
npm run db:migrate

# 3. Enter a migration name when prompted (e.g., "add_user_preferences")
```

### Production

```bash
# Apply pending migrations
npm run db:migrate:prod
```

### Rollback (Manual)

Prisma doesn't support automatic rollbacks. To rollback:

1. Create a new migration that reverses the changes
2. Or restore from a database backup

```bash
# Generate SQL for down migration (manual review required)
npx prisma migrate diff --from-schema prisma/schema.prisma --to-migrations prisma/migrations --script
```

## Test Accounts

After seeding, these accounts are available:

| Email | Password | Role | Status |
|-------|----------|------|--------|
| john.trucker@example.com | password123 | Owner Operator | Completed onboarding |
| sarah.fleet@example.com | password123 | Fleet Manager | Completed onboarding |
| mike.dispatch@example.com | password123 | Dispatcher | Completed onboarding |
| new.user@example.com | password123 | Owner Operator | Mid-onboarding (step 2) |

## Seed Data Overview

The seed script creates realistic test data:

### Users & Settings
- 4 user accounts (3 complete, 1 mid-onboarding)
- Custom operating cost settings for experienced users
- Industry default settings for new users

### Vehicles
- 8 vehicles across different types:
  - 2 Semi trucks (dry van, flatbed)
  - 1 Reefer truck
  - 1 Box truck
  - 1 Sprinter van
  - 1 Cargo van

### Quotes
- 6 sample quotes with various statuses:
  - Completed load (with booking record)
  - Booked loads (with booking records)
  - Calculated (pending) quotes
  - Expired quote
- Includes realistic cost breakdowns and market data

### Cache Data
- Fuel prices for 41 US states
- Toll calculations for popular routes

### Additional Data
- Saved trips (favorite routes)
- User rewards and achievements
- Referral codes

## Schema Files

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Prisma schema definition |
| `prisma/seed.js` | Seed script with test data |
| `prisma/migrations/` | Migration history |
| `database/schema.sql` | Raw SQL schema (reference) |
| `database/SCHEMA-DOCUMENTATION.md` | Detailed schema docs |

## Prisma Studio

Visual database browser for development:

```bash
npm run db:studio
```

Opens at http://localhost:5555

## Database Schema

### Core Tables

```
users                 - User accounts
├── vehicles          - User's fleet vehicles
├── user_settings     - Operating costs & preferences
├── quotes            - Rate calculations
│   └── booking_records - Booked load details
├── saved_trips       - Favorite routes
├── user_rewards      - Achievement tracking
├── referrals         - Referral program
└── api_usage         - Rate limiting
```

### Cache Tables

```
fuel_price_cache      - State fuel prices (24h TTL)
toll_cache            - Route toll calculations (7d TTL)
```

## Troubleshooting

### Connection Issues

```bash
# Test connection
npx prisma db pull

# If connection fails, check:
# 1. PostgreSQL is running
# 2. DATABASE_URL is correct
# 3. Database exists
# 4. User has permissions
```

### Migration Conflicts

```bash
# Reset and start fresh (WARNING: deletes all data)
npm run db:reset

# Or manually resolve
npx prisma migrate resolve --applied "migration_name"
```

### Prisma Client Out of Sync

```bash
# Regenerate client after schema changes
npm run db:generate
```

### Seed Failures

```bash
# Check for existing data conflicts
npm run db:studio

# Or reset and reseed
npm run db:reset
```

## Environment-Specific Setup

### Local Development

```bash
# Install PostgreSQL (macOS)
brew install postgresql@14
brew services start postgresql@14

# Create database
createdb freight_calculator

# Setup
npm run db:push
npm run db:seed
```

### Docker

```bash
# Start PostgreSQL container
docker run --name freight-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=freight_calculator \
  -p 5432:5432 \
  -d postgres:14

# Update .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/freight_calculator"

# Run migrations
npm run db:migrate
```

### Vercel + Neon/Supabase

1. Create database on Neon or Supabase
2. Copy connection string to Vercel environment variables
3. Deploy - migrations run automatically via `npm run build`

## Security Notes

- Never commit `.env` files
- Use different databases for dev/staging/production
- Rotate database credentials regularly
- Enable SSL in production (`?sslmode=require`)
- The seed passwords are SHA-256 hashed (use bcrypt in production)
