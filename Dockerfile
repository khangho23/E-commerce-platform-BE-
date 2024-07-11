# Use the ubuntu base image
FROM ubuntu

# Set the working directory in the container
WORKDIR /app

# Install curl, Node.js and npm in one layer to reduce image size
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Set environment variables
ENV PORT=8000 \
    DEV_APP_PORT=8000\
    DEV_DB_HOST=localhost\
    DEV_DB_PORT=27017\
    DEV_DB_NAME=shopDEV\
    PRO_APP_PORT=8080\
    PRO_DB_HOST=localhost\
    PRO_DB_PORT=27017\
    PRO_DB_NAME=shopPRO

# Copy entire current directory to the working directory
COPY . /app

# Install the dependencies
RUN npm install

# Define the port number the container should expose
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]