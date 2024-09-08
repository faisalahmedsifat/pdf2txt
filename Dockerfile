# Use the official Node.js image
FROM node:lts-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 6789

# Set environment variable for port
ENV PORT=6789

# Command to run the app
CMD ["node", "main.mjs"]
