# NEURONE Dockerfile

# https://medium.com/@isohaze/how-to-dockerize-a-meteor-1-4-app-120a34089ddb
# https://projectricochet.com/blog/production-meteor-and-node-using-docker-part-i

FROM phusion/passenger-nodejs:0.9.19

# Contact the maintainer in case of problems
MAINTAINER Daniel Gacitua <daniel.gacitua@usach.cl>

# Update Passenger Phusion
# RUN apt-get update && apt-get upgrade -y -o Dpkg::Options::="--force-confold"

# Set work directory
RUN mkdir -p /home/app
WORKDIR /home/app
ADD . ./src

# Do basic updates
RUN apt-get update -q && apt-get clean

# Install curl & Meteor
RUN apt-get install -y curl && (curl https://install.meteor.com/ | sh)

# Build Meteor app
RUN (cd /home/app/src && meteor build ../neurone --directory)

# Install NPM packages
RUN (cd /home/app/neurone/bundle/programs/server && npm install --quiet)

# Remove Meteor
RUN rm /usr/local/bin/meteor && rm -rf ~/.meteor

# Remove curl
RUN apt-get autoremove -y --purge curl

# Create NEURONE assets folder
RUN mkdir -p /assets
RUN chown -R app:app /assets
RUN chmod -R +rw /assets

# Set internal Meteor environment variables
ENV NEURONE_ASSET_PATH /assets
ENV HTTP_FORWARDED_COUNT 1

# Copy Nginx config files
RUN cp /home/app/src/.deploy/docker/neurone.conf /etc/nginx/sites-enabled/neurone.conf
RUN cp /home/app/src/.deploy/docker/meteor-env.conf /etc/nginx/main.d/meteor-env.conf

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