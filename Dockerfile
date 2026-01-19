FROM node:18-alpine

WORKDIR /app

# Copy package files from stock-advisor directory
COPY stock-advisor/package*.json ./

# Install dependencies
RUN npm ci

# Copy all source code from stock-advisor directory
COPY stock-advisor/ .

# Build the app
RUN npm run build

# Install serve to run the app
RUN npm install -g serve

EXPOSE 8080

CMD ["serve", "-s", "build", "-l", "8080"]

