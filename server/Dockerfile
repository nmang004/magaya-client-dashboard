FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY server/package.json server/package-lock.json ./
RUN npm install --production

# Copy app source
COPY server/ .

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]