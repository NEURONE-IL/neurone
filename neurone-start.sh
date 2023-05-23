#!/bin/bash

set -u
set -e

# Load environment variables from file
set -o allexport
source ./dotenv
set +o allexport

# Start with Docker Compose after all environment variables are declared
printf "%b\n" "\e[1;92m>> Starting NEURONE for user: $NEURONE_USERNAME (UID: $NEURONE_USERID)\e[0m"
printf "%b\n" "\e[1;92mWARNING: Docker and Docker Compose are mandatory dependencies needed to run this script!\e[0m"

docker compose -p neurone up -d

set +e
set +u