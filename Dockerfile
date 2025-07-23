# Use the official Nginx image as the base image
FROM nginx:alpine

# Copy the content of your website (everything in this folder) to Nginx container's web directory
COPY . /usr/share/nginx/html

# Expose port 80 (default for web traffic)
EXPOSE 80

# Run Nginx in the foreground (required in containers)
CMD ["nginx", "-g", "daemon off;"]
