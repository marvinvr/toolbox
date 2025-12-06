FROM nginx:alpine

# Copy the HTML file to the nginx html directory
COPY index.html /usr/share/nginx/html/
COPY test.jpeg /usr/share/nginx/html/
COPY favicon.ico /usr/share/nginx/html/

# Nginx runs on port 80 by default
EXPOSE 80

# Nginx starts automatically in the base image, so no CMD needed 