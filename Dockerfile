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

# Install basic dependencies
RUN apt-get -qq update \
    && apt-get clean \
    && apt-get -qq install curl wget unzip

# Copy config files
RUN cp /home/app/src/.deploy/docker/neurone.conf /etc/nginx/sites-enabled/neurone.conf \
    && cp /home/app/src/.deploy/docker/meteor-env.conf /etc/nginx/main.d/meteor-env.conf \
    && cp /home/app/src/.deploy/docker/meteorBuild.sh /home/app/meteorBuild.sh \
    && chmod +x /home/app/meteorBuild.sh

# Run as 'app' user
USER app

# Set Meteor Framework location as environment variable
ENV PATH $PATH:$HOME/.meteor

# Installation and packaging script
RUN /home/app/meteorBuild.sh

## Code deprecated due to install script
#RUN curl https://install.meteor.com/ | sh \
#
## Build Meteor app
#    && cd /home/app/src \
#    && meteor npm install --quiet \
#    && meteor build ../neurone --directory --server-only \
#
## Install NPM packages
#    && cp -r /home/app/neurone/bundle/. /home/app/neurone \
#    && rm -rf /home/app/neurone/bundle \
#    && cd /home/app/neurone/programs/server \
#    && npm install --quiet \
#
## Remove sources
#    && rm -rf /home/app/src \
#
## Remove Meteor
#    && rm -rf $HOME/.meteor

# Run as 'root' user
USER root

# Create NEURONE assets folder
RUN mkdir -p /assets \
    && chown -R app:app /assets \
    && chmod -R +rw /assets

# Set internal Meteor environment variables
ENV NEURONE_ASSET_PATH /assets
ENV HTTP_FORWARDED_COUNT 1

# Enable Nginx and Passenger
RUN rm -f /etc/nginx/sites-enabled/default \
    && rm -f /etc/service/nginx/down

# Set ports, data volumes and commands
EXPOSE 80
VOLUME ["/assets"]
CMD ["/sbin/my_init"]

# Clean up APT when done
RUN apt-get clean && rm -rf /tmp/* /var/tmp/*