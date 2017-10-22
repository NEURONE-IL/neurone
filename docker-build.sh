#!/bin/bash

set -u
set -e

export NEURONE_USERNAME=${NEURONE_USERNAME:-neurone}
export NEURONE_USERID=${NEURONE_USERID:-$(id -u)}

docker-compose build

set +e
set +u