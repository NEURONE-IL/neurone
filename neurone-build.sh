#!/bin/bash

set -u
set -e

# Load environment variables from file
set -o allexport
source ./dotenv
set +o allexport

# Create directories in filesystem
printf "%b\n" "\e[1;92m>> Creating filesystem directories for persistence...\e[0m"
printf "%b\n" "\e[1;92mWARNING: sudo permissions for current user may be required\e[0m"

mkdir -p $NEURONE_ASSET_PATH
mkdir -p $NEURONE_MONGO_PATH
mkdir -p $NEURONE_INDEX_PATH && sudo chown -R 8983:8983 $NEURONE_INDEX_PATH

# Build with Docker Compose after all environment variables are declared
printf "%b\n" "\e[1;92m>> Building NEURONE deploy images for user: $NEURONE_USERNAME (UID: $NEURONE_USERID)\e[0m"
printf "%b\n" "\e[1;92mWARNING: Docker and Docker Compose are mandatory dependencies needed to run this script!\e[0m"

docker compose -p neurone build

set +e
set +u