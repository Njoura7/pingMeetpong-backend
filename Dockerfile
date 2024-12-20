# Step 1: Use an official Node.js runtime as a base image
FROM node:18

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package files
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the entire app
COPY . .

# Step 6: Build the app (if TypeScript is used)
RUN npm run build

# Step 7: Expose the port your app runs on
EXPOSE 7000

# Step 8: Start the application
CMD ["npm", "start"]
