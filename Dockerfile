# Use the official Nginx image as the base image
FROM nginx:alpine

# Copy the content of your website to Nginx container's web directory
COPY ./templatemo_589_lugx_gaming/ /usr/share/nginx/html

# This is the new line:
# Copy our custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (default for web traffic)
EXPOSE 80

# Run Nginx in the foreground (required in containers)
CMD ["nginx", "-g", "daemon off;"]