# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Clone your backend repository from GitHub
RUN git clone https://github.com/dlobregon/amm_report_frontend

# Install backend dependencies
WORKDIR /app/amm_report_frontend
RUN npm install

EXPOSE 3000

# Command to start frontend
CMD ["npm", "start"] 
