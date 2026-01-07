#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy --schema=/app/prisma/schema.prisma

echo "Starting server..."
exec node dist/index.js
