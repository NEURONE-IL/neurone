# TODO Test Docker deploy

# Set Passenger Docker Image for Node.js
FROM phusion/passenger-nodejs:0.9.19

# Set mantainer
MANTAINER Daniel Gacitua <daniel.gacitua@usach.cl>

# Set correct environment variables.
ENV HOME /root

# Use baseimage-docker's init process.
CMD ["/sbin/my_init"]

# ...put your own build instructions here...

# Create app directory
RUN mkdir /home/app/neurone

# Deploy the Nginx configuration file for neurone
ONBUILD COPY docker/neurone.conf /etc/nginx/sites-enabled/neurone.conf
ONBUILD COPY docker/meteor-env.conf /etc/nginx/main.d/meteor-env.conf
ONBUILD ADD ./.deploy/bundle /home/app/neurone

# Enable Nginx and Passenger
RUN rm -f /etc/service/nginx/down

# Expose port 80
EXPOSE 80

# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*