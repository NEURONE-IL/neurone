#!/bin/bash

set -u
set -e

printf "\e[1;32m>>\e[31m Building NEURONE as a Node.js application on parent directory... \e[1;32m<<\e[0m\n"

meteor build .. --server-only --architecture=os.linux.x86_64

set +u
set +e