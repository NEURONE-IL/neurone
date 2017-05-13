#!/bin/sh

# NEURONE Docker Deploy Script
# MAINTAINER: Daniel Gacitua <daniel.gacitua@usach.cl>

set -u
set -e

echo -e "\e[1;32m>> \e[31mNEURONE Docker Deploy Script <<\e[0m"
echo -e "\e[1;32m>> \e[31mMAINTAINER Daniel Gacitua <daniel.gacitua@usach.cl> <<\e[0m"

echo -e ""
echo -e "\e[1;32m>> \e[31mBundle Meteor project... \e[33m[1/5]\e[0m"

meteor build --architecture=os.linux.x86_64 ./build --directory

echo -e ""
echo -e "\e[1;32m>> \e[31mCopy deploy files... \e[33m[2/5]\e[0m"

cp Dockerfile ./build/bundle
cp docker-compose.yml ./build/bundle
cp .dockerignore ./build/bundle
cp .deploy/docker/meteor-env.conf ./build/bundle
cp .deploy/docker/neurone.conf ./build/bundle

echo -e ""
echo -e "\e[1;32m>> \e[31mBuild and deploy NEURONE... \e[33m[3/5]\e[0m"

cd ./build/bundle
docker-compose up

echo -e ""
echo -e "\e[1;32m>> \e[31mDelete temporal files... \e[33m[4/5]\e[0m"
cd ../..
rm -rf ./build

echo -e ""
echo -e "\e[1;32m>> \e[31mNEURONE is deployed and working! \e[33m[5/5]\e[0m"

set +u
set +e