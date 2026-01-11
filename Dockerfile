FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source and build
COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# Remove dev dependencies and source
RUN rm -rf src node_modules && \
    npm ci --only=production

# Run as non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

# MCP servers communicate via stdio
CMD ["node", "dist/index.js"]
