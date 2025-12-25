# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install OpenSSL and other dependencies
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 4000

# Create startup script
RUN echo '#!/bin/sh\nset -e\necho "Starting migrations..."\nnpx prisma migrate deploy || echo "Migration done or skipped"\necho "Starting seed..."\nnpm run seed || echo "Seed done or skipped"\necho "Starting application..."\nnpm run start\n' > /app/startup.sh && chmod +x /app/startup.sh

# Start the application
CMD ["/app/startup.sh"]
