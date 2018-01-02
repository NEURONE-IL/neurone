#!/bin/bash

set -u
set -e

export NEURONE_USERNAME=${NEURONE_USERNAME:-neurone}
export NEURONE_USERID=${NEURONE_USERID:-$(id -u)}

printf "%b\n" "\e[1;92m>> Building NEURONE deploy images for user: $NEURONE_USERNAME (UID: $NEURONE_USERID)\e[0m"
printf "%b\n" "\e[1;92mWARNING: Docker and Docker Compose are mandatory dependencies needed to run this script!\e[0m"

docker-compose -p neurone build

set +e
set +u