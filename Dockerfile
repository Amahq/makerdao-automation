# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only package files to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files to the container
COPY . .

# Build the TypeScript code into JavaScript
RUN npm run build

# Expose the application's default port (adjust if necessary)
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]
