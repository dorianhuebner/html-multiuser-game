# Use Node.js as base image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "server.js"]

# Ensure your Dockerfile has these lines
COPY package*.json ./
COPY src ./src
COPY server.js ./