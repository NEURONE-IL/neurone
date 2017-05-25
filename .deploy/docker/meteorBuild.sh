#!/bin/bash

set -u
set -e

printf "%b" "\e[1;31m>> Install Meteor [1/7]\e[0m"

curl https://install.meteor.com/ | sh

printf "%b" "\e[1;31m>> Build Meteor app as Node.js app [2/7]\e[0m"

(cd /home/app/src && meteor npm install --quiet && meteor build ../neurone --directory --server-only)

printf "%b" "\e[1;31m>> Moving app to \e[0m"

cp -r /home/app/neurone/bundle/. /home/app/neurone
rm -rf /home/app/neurone/bundle

printf "%b" "\e[1;31m>> \e[0m"

(cd /home/app/neurone/programs/server && npm install --production --quiet)

printf "%b" "\e[1;31m>> \e[0m"

rm -rf /home/app/src 

printf "%b" "\e[1;31m>> \e[0m"

rm -rf $HOME/.meteor

printf "%b" "\e[1;31m>> \e[0m"

set +u
set +e