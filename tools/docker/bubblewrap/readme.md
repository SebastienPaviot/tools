# PWA to Android App with Bubblewrap and Docker

This repository contains a Docker setup for converting a Progressive Web App (PWA) into an Android application using **Bubblewrap**. The provided `Dockerfile` simplifies the process by setting up an environment with all the necessary dependencies.

## Dockerfile

The `Dockerfile` in this repository is based on Node.js and installs Bubblewrap CLI globally. This containerized setup allows you to work in a consistent environment, without the need to install Bubblewrap locally.

### How to Use

1. **Build the Docker Image**  
   Run the following command to build the Docker image:
   ```bash
   docker build -t my-bubblewrap-container .

