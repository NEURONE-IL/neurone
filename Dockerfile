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
ENV HOME /home/app
WORKDIR /home/app

# Add all files
ADD . ./src
RUN chown -R app:app ./src

# Do basic updates
RUN apt-get -qq update && apt-get clean

# Install curl & wget
RUN apt-get -qq install curl wget

# Install gosu
# RUN curl -o /usr/local/bin/gosu -sSL "https://github.com/tianon/gosu/releases/download/1.2/gosu-$(dpkg --print-architecture)" && chmod +x /usr/local/bin/gosu

# Run as 'app' user
USER app

# Install Meteor
RUN curl https://install.meteor.com/ | sh
ENV PATH $PATH:$HOME/.meteor

# Build Meteor app
RUN cd /home/app/src && meteor build ../neurone --directory

# Install NPM packages
RUN cd /home/app/neurone/bundle/programs/server && npm install --quiet

# Remove Meteor
RUN rm -rf $HOME/.meteor && rm /usr/local/bin/meteor

# Run as 'root'
USER root

# Create NEURONE assets folder
RUN mkdir -p /assets \
    && chown -R app:app /assets \
    && chmod -R +rw /assets

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