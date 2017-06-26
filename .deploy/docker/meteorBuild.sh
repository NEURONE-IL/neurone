#!/bin/bash

set -u
set -e

printf "%b" "\e[1;31m>> Installing Meteor Framework[1/7]\e[0m"

curl https://install.meteor.com/ | sh

printf "%b" "\e[1;31m>> Building Meteor app as Node.js app [2/7]\e[0m"

(cd /home/app/src && meteor npm install --quiet && meteor build ../neurone --directory --server-only)

printf "%b" "\e[1;31m>> Moving app to /home/app/neurone [3/7]\e[0m"

cp -r /home/app/neurone/bundle/. /home/app/neurone
rm -rf /home/app/neurone/bundle

printf "%b" "\e[1;31m>> Installing NPM dependencies [4/7]\e[0m"

(cd /home/app/neurone/programs/server && npm install --production --quiet)

printf "%b" "\e[1;31m>> Removing source code files [5/7]\e[0m"

rm -rf /home/app/src 

printf "%b" "\e[1;31m>> Removing Meteor Framework [6/7]\e[0m"

rm -rf $HOME/.meteor

printf "%b" "\e[1;31m>> NEURONE app is packaged and ready to run! [7/7]\e[0m"

set +u
set +e