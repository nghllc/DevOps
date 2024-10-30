# Use a Node.js image as the base
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that Vite runs on
EXPOSE 5173

# Start the Vite development server
CMD ["npm", "run", "dev"]