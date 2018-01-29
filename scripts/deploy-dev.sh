#!/bin/bash

ASSET_PATH="./assets"
mkdir -p $ASSET_PATH

printf "\e[1;32m>>\e[31m Exporting Locales for MongoDB... \e[1;32m<<\e[0m\n"
export LC_ALL=C.UTF-8

printf "\e[1;32m>>\e[31m Exporting Asset Path for NEURONE... \e[1;32m<<\e[0m\n"
export NEURONE_ASSET_PATH=$(cd $ASSET_PATH; pwd)

printf "\e[1;32m>>\e[31m Exporting local Solr Enviroment Variables... \e[1;32m<<\e[0m\n"
export NEURONE_SOLR_HOST="127.0.0.1"
export NEURONE_SOLR_PORT="8983"
export NEURONE_SOLR_CORE="neurone"

printf "\e[1;32m>>\e[31m Exporting default NEURONE Locale... \e[1;32m<<\e[0m\n"
export NEURONE_LOCALE="en"

printf "\e[1;32m>>\e[31m Launching NEURONE development server... \e[1;32m<<\e[0m\n"
meteor