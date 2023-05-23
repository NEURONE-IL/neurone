#!/bin/bash

set -u
set -e

# Load environment variables from file
set -o allexport
source dotenv
set +o allexport

printf "\e[1;32m>>\e[31m Stopping NEURONE development dependencies from Docker Compose! \e[1;32m<<\e[0m\n"
cd ./.deploy/dev && docker compose down

set +u
set +e