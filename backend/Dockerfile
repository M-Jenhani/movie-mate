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

# Copy startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 4000

# Start the application with startup script
CMD ["/app/start.sh"]
