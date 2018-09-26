# NEURONE Dockerfile

# https://medium.com/@isohaze/how-to-dockerize-a-meteor-1-4-app-120a34089ddb
# https://projectricochet.com/blog/production-meteor-and-node-using-docker-part-i

FROM phusion/passenger-nodejs:0.9.35

# Contact the maintainer in case of problems
MAINTAINER Daniel Gacitua <daniel.gacitua@usach.cl>

# Install basic dependencies
RUN apt-get -qq update \
  && apt-get -qq --no-install-recommends install curl ca-certificates wget python unzip bsdtar

# Set user
ARG username=user
ARG userid=9001
ENV LOCAL_USER_NAME $username
ENV LOCAL_USER_ID $userid
ADD ./.deploy/docker/createUser.sh /tmp/createUser.sh
RUN chmod +x /tmp/createUser.sh && ./tmp/createUser.sh

# Set working directory
RUN mkdir -p /app && chown -R $username:$username /app
WORKDIR /app
ENV HOME /home/$username

# Add all files
ADD . ./src
RUN chown -R $username:$username ./src

# Copy config files
RUN cp ./src/.deploy/docker/neurone.conf /etc/nginx/sites-enabled/neurone.conf \
  && cp ./src/.deploy/docker/meteor-env.conf /etc/nginx/main.d/meteor-env.conf \
  && cp ./src/.deploy/docker/meteorBuild.sh ./meteorBuild.sh \
  && cp ./src/.deploy/docker/fixPermissions.sh ./fixPermissions.sh \
  && chmod +x ./meteorBuild.sh \
  && chmod +x ./fixPermissions.sh

# Set Meteor Framework location as environment variable
ENV PATH $PATH:$HOME/.meteor

# Set Build Memory Limit
ENV TOOL_NODE_FLAGS --optimize_for_size --max_old_space_size=1536 --gc_interval=100

# Installation and packaging script
RUN /sbin/setuser $username ./meteorBuild.sh

# Create NEURONE assets directory
RUN mkdir -p /assets
RUN ./fixPermissions.sh /assets $username

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
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*