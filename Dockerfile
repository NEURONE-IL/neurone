# NEURONE Dockerfile
# Instructions from https://medium.com/@isohaze/how-to-dockerize-a-meteor-1-4-app-120a34089ddb
FROM phusion/passenger-nodejs:0.9.19

# Contact the maintainer in case of problems
MAINTAINER Daniel Gacitua <daniel.gacitua@usach.cl>

# Set correct environment variables
ENV HOME /root

# Create app directory
RUN mkdir -p /home/app/neurone

# Create NEURONE assets folder
RUN mkdir -p /assets
RUN chown -R app:app /assets
RUN chmod -R +rw /assets

# Set internal Meteor environment variables
ENV NEURONE_ASSET_PATH /assets
ENV HTTP_FORWARDED_COUNT 1

# Copy bundle contents to directory
COPY . /home/app/neurone
COPY neurone.conf /etc/nginx/sites-enabled/neurone.conf
COPY meteor-env.conf /etc/nginx/main.d/meteor-env.conf

# Install NPM packages
RUN (cd /home/app/neurone/programs/server && npm install --quiet)

# Remove default nginx host to make the app listen on all domain names
RUN rm /etc/nginx/sites-enabled/default

# Enable Nginx and Passenger
RUN rm -f /etc/service/nginx/down

# Set ports, data volumes and commands
EXPOSE 80
VOLUME ["/assets"]
CMD ["/sbin/my_init"]

# Clean up APT when done
RUN apt-get clean && rm -rf /tmp/* /var/tmp/*