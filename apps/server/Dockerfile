# Use Node.js LTS on Alpine for a lightweight image
FROM node:lts-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json (since you don't have package-lock.json)
COPY package.json ./

# Install dependencies (use npm install instead of npm ci)
RUN npm install --production

# Copy the rest of the source code
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Set environment variable for production
ENV NODE_ENV=production

# Start the app
CMD ["node", "src/index.js"]