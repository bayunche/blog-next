FROM node:18-alpine

WORKDIR /app

# Copy package.json and install dependencies
# Using npmmirror for better connectivity in China
COPY package.json ./
RUN npm install --production --registry=https://registry.npmmirror.com

# Copy the rest of the application code
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]
