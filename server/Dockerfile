FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Copy app source
COPY . .

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]