# # Base image
# FROM oven/bun:latest AS base

# # Accept DATABASE_URL as a build argument
# ARG DATABASE_URL

# # Set the environment variable
# ENV DATABASE_URL=$DATABASE_URL
# ENV JWT_SECRET_KEY=$JWT_SECRET_KEY

# # Create app directory in server folder
# WORKDIR /usr/src/app/server

# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# COPY package*.json ./

# # Install app dependencies
# RUN bun install
# RUN bun add @nestjs/jwt

# # Bundle app source
# COPY . .

# EXPOSE 3000

# # Start the server using the production build
# CMD ["sh", "-c", "bun run start"]


# Base image
FROM node:alpine AS builder

# Accept DATABASE_URL as a build argument
ARG DATABASE_URL

# Create app directory in server folder
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN bun install && bun add @nestjs/jwt

# Bundle app source
COPY . .

# Build the application
RUN bun build

# Production image
FROM node:alpine

# Set the environment variable
ENV DATABASE_URL=$DATABASE_URL
ENV JWT_SECRET_KEY=$JWT_SECRET_KEY

WORKDIR /usr/src/app

# Copy built assets from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

# Start the server using the production build
CMD ["sh", "-c", "bun run start"]
