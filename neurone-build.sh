#!/bin/bash

set -u
set -e

# Running host user environment variables
export NEURONE_USERNAME=${NEURONE_USERNAME:-neurone}
export NEURONE_USERID=${NEURONE_USERID:-$(id -u)}

# Filesystem persistence environment variables
export NEURONE_MONGO_PATH=${NEURONE_MONGO_PATH:-~/neuroneDatabase}
export NEURONE_ASSET_PATH=${NEURONE_ASSET_PATH:-~/neuroneAssets}
export NEURONE_INDEX_PATH=${NEURONE_INDEX_PATH:-~/neuroneIndex}

# Database environment variables
export NEURONE_ADMIN_DB_USER=${NEURONE_ADMIN_DB_USER:-admin}
export NEURONE_ADMIN_DB_PASS=${NEURONE_ADMIN_DB_PASS:-neurone2017}
export NEURONE_DB=${NEURONE_DB:-neurone}
export NEURONE_DB_USER=${NEURONE_DB_USER:-neurone}
export NEURONE_DB_PASS=${NEURONE_DB_PASS:-neurone2017}

# Solr Inverted Index environment variables
export NEURONE_SOLR_CORE=${NEURONE_SOLR_CORE:-neurone}

# NEURONE environment variables
export NEURONE_HOST=${NEURONE_HOST:-localhost}

# Create directories in filesystem
printf "%b\n" "\e[1;92m>> Creating filesystem directories for persistence...\e[0m"
printf "%b\n" "\e[1;92mWARNING: sudo permissions for current user may be required\e[0m"

mkdir -p $NEURONE_ASSET_PATH
mkdir -p $NEURONE_MONGO_PATH
mkdir -p $NEURONE_INDEX_PATH && sudo chown -R 8983:8983 $NEURONE_INDEX_PATH

# Build with Docker Compose after all environment variables are declared
printf "%b\n" "\e[1;92m>> Building NEURONE deploy images for user: $NEURONE_USERNAME (UID: $NEURONE_USERID)\e[0m"
printf "%b\n" "\e[1;92mWARNING: Docker and Docker Compose are mandatory dependencies needed to run this script!\e[0m"

docker-compose -p neurone build

set +e
set +u