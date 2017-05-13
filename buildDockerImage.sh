#!/bin/sh

meteor build --architecture=os.linux.x86_64 ./.neuroneBuild --directory

cp Dockerfile ./.neuroneBuild/bundle
cp .dockerignore ./.neuroneBuild/bundle
cp .deploy/docker/meteor-env.conf ./.neuroneBuild/bundle
cp .deploy/docker/neurone.conf ./.neuroneBuild/bundle

cd ./.neuroneBuild/bundle
docker build -t dgacitua/neurone .
cd ../..
rm -rf .neuroneBuild/