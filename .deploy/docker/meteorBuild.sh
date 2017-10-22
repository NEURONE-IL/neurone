#!/bin/bash

set -u
set -e

HOMEDIR=$(pwd)

printf "%b\n" "\e[1;31m>> Installing Meteor Framework [1/8]\e[0m"

curl https://install.meteor.com/ | sh

printf "%b\n" "\e[1;31m>> Packaging NPM dependencies [2/8]\e[0m"

export TOOL_NODE_FLAGS="--optimize_for_size --max_old_space_size=768 --gc_interval=100"
(cd $HOMEDIR/src && meteor npm install --quiet)

printf "%b\n" "\e[1;31m>> Building Meteor app as Node.js app [3/8]\e[0m"

(cd $HOMEDIR/src && meteor build ../neurone --directory --server-only)

printf "%b\n" "\e[1;31m>> Moving app to ~/neurone [4/8]\e[0m"

cp -r $HOMEDIR/neurone/bundle/. $HOMEDIR/neurone
rm -rf $HOMEDIR/neurone/bundle

printf "%b\n" "\e[1;31m>> Installing NPM dependencies [5/8]\e[0m"

(cd $HOMEDIR/neurone/programs/server && npm install --production --quiet)

printf "%b\n" "\e[1;31m>> Removing source code files [6/8]\e[0m"

rm -rf $HOMEDIR/src 

printf "%b\n" "\e[1;31m>> Removing Meteor Framework [7/8]\e[0m"

rm -rf $HOME/.meteor

printf "%b\n" "\e[1;31m>> NEURONE app is packaged and ready to run! [8/8]\e[0m"

set +u
set +e