#!/bin/sh

echo "Running Prisma migrations..."
npx prisma migrate deploy || true

echo "Seeding database..."
npx ts-node src/seed.ts || true

echo "Starting application..."
node dist/index.js
