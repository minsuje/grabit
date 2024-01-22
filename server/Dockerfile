# Base image
FROM oven/bun:latest AS base

# Accept DATABASE_URL as a build argument
ARG DATABASE_URL

# Set the environment variable
ENV DATABASE_URL=$DATABASE_URL
ENV JWT_SECRET=$JWT_SECRET
ENV AWS_S3_ACCESS_KEY=$AWS_S3_ACCESS_KEY
ENV AWS_S3_SECRET_KEY=$AWS_S3_SECRET_KEY

# Create app directory in server folder
WORKDIR /usr/src/app/server

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN bun install
RUN bun add @nestjs/jwt

# Bundle app source
COPY . .

EXPOSE 3000

# Start the server using the production build
CMD ["sh", "-c", "bun run start"]

