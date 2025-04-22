# Step 1: Use official Node.js image as the base image
FROM node:18-alpine

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Step 4: Install dependencies
RUN yarn install

# Step 5: Copy the rest of the application files into the container
COPY . .

# Step 6: Expose the application port (use the same port as in your app.js)
EXPOSE 3000

# Step 7: Start the application
CMD ["yarn", "start"]