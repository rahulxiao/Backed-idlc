# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml nest-cli.json tsconfig.json tsconfig.build.json ./

# Install all dependencies (including devDependencies needed for build)
RUN pnpm install --frozen-lockfile

# Copy application source code
COPY app ./app

# Build the production output to /app/dist
RUN pnpm run build

# Stage 2: Production runtime stage
FROM node:20-alpine AS production

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy compiled application code from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/nest-cli.json ./nest-cli.json

# Create uploads directory for document persistence
RUN mkdir -p uploads/documents

# Set environment defaults
ENV NODE_ENV=production
ENV PORT=4001

EXPOSE 4001

CMD ["node", "dist/main"]
