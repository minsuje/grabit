# Base image

FROM oven/bun:latest AS base

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN bun install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN bun run start

# Start the server using the production build
CMD [ "node", "dist/main.js" ]