#!/bin/bash

set -u
set -e

export LC_ALL=C.UTF-8

printf "\e[1;32m>>\e[31m Running NEURONE Unit Tests! \e[1;32m<<\e[0m"
meteor npm run test

printf "\e[1;32m>>\e[31m Running NEURONE Integration Tests! \e[1;32m<<\e[0m"
meteor npm run apptest

printf "\e[1;32m>>\e[31m Tests ran successfully! \e[1;32m<<\e[0m"
printf "\n"

set +u
set +e