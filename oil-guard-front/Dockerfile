# Use the official Node.js 18 base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy application files
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Expose the port Next.js will run on
EXPOSE 3000

# Run the application in development mode
CMD ["npm", "run", "dev"]
