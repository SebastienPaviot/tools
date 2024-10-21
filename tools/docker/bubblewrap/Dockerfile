# Use the official Node.js image
FROM node:18

# Create a working directory
WORKDIR /usr/src/app

# Install Bubblewrap CLI globally
RUN npm install -g @bubblewrap/cli

# Expose the port if necessary (optional, depending on your needs)
EXPOSE 8080

# Keep the container running
CMD ["tail", "-f", "/dev/null"]
