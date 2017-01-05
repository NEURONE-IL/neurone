#!/bin/sh

# NEURONE Full deploy script from source
# Optimized for Continous Integration services (like Travis CI)
# MAINTAINER: Daniel Gacitua <daniel.gacitua@usach.cl>

set -u
set -e

# You must set the following environment variables
# HOST     Server hostname or IP address (eg: 123.45.67.89 or neurone.mydomain.org)
# USER     Username part of Docker group on host machine (eg: neurone)
# SSHPASS  Password of the chosen username (eg: MySecretPass)
# WORKDIR  Home directory of chosen username (eg: /home/neurone)
# NEURONE_DB_USER     Database administrator name, will be created if not exists (eg: neuroneAdmin)
# NEURONE_DB_PASS     Database administrator password (eg: neuronePassword)
# NEURONE_DB_PATH     Directory where database contents will be written (eg: /home/neurone/data)
# NEURONE_ASSET_PATH  Directory where NEURONE documents and other assets are located (eg: /home/neurone/assets)

# Internal environment variables (do not modify if you don't know what you're doing)
NEURONE_MONGO_DATABASE="neurone"
NEURONE_SOLR_CORE="neurone"
NEURONE_APP_NAME="neurone-app"
NEURONE_AJAX_NAME="neurone-ajax"
NEURONE_APP_PORT=80
NEURONE_DB_NAME="neurone-db"
NEURONE_DB_PORT=27017
NEURONE_SOLR_NAME="neurone-search"
NEURONE_SOLR_PORT=8983

### BUILD START ###
echo ">> Bundle Meteor project... [1/13]"
meteor build --architecture=os.linux.x86_64 ./.neuroneBuild --directory

echo ">> Copying files for project... [2/13]"
cp Dockerfile ./.neuroneBuild/bundle
cp .dockerignore ./.neuroneBuild/bundle
cp .deploy/docker/meteor-env.conf ./.neuroneBuild/bundle
cp .deploy/docker/neurone.conf ./.neuroneBuild/bundle

echo ">> Building Docker image... [3/13]"
cd ./.neuroneBuild/bundle
docker build -t dgacitua/neurone .
cd ../..
rm -rf .neuroneBuild/


### DEPLOY START ###
echo ">> Creating offline image... [4/13]"
docker save -o neuroneimage.tar dgacitua/neurone 

echo ">> Copying files to remote host... [5/13]"
scp dockerDeploy.sh $USER@$HOST:$WORKDIR
scp neuroneimage.tar $USER@$HOST:$WORKDIR

echo ">> Removing local offline image... [6/13]"
rm neuroneimage.tar

echo ">> Removing old Docker app containers... [7/13]"
ssh $USER@$HOST "docker stop $NEURONE_DB_NAME || true && docker stop $NEURONE_SOLR_NAME || true && docker stop $NEURONE_APP_NAME || true"
ssh $USER@$HOST "docker rm $NEURONE_DB_NAME || true && docker rm $NEURONE_SOLR_NAME || true && docker rm $NEURONE_APP_NAME || true"


echo ">> Loading offline image in remote host... [8/13]"
ssh $USER@$HOST docker load -i $WORKDIR/neuroneimage.tar
ssh $USER@$HOST rm $WORKDIR/neuroneimage.tar

echo ">> Deploy MongoDB database in remote host... [9/13]"
ssh $USER@$HOST docker run -d \
                -p $NEURONE_DB_PORT:27017 \
                -v $NEURONE_DB_PATH:/data/db \
                --name $NEURONE_DB_NAME  \
                --restart=unless-stopped \
                mongo \
                mongod --auth

echo ">> Setting up authentication and databases in remote host... [10/13]"
ssh $USER@$HOST "docker exec -t $NEURONE_DB_NAME mongo admin --eval \\
                \"db.createUser({ user: \\\"admin\\\", pwd: \\\"$NEURONE_DB_PASS\\\", \\
                roles: [{ role: \\\"root\\\", db: \\\"admin\\\" }]})\" || true"

ssh $USER@$HOST "docker exec -t $NEURONE_DB_NAME mongo $NEURONE_MONGO_DATABASE -u \"admin\" -p \"$NEURONE_DB_PASS\" --authenticationDatabase \"admin\" --eval \\
                \"db.createUser({ user: \\\"$NEURONE_DB_USER\\\", pwd: \\\"$NEURONE_DB_PASS\\\", \\
                roles: [{ role: \\\"dbOwner\\\", db: \\\"$NEURONE_MONGO_DATABASE\\\" }]})\" || true"

echo ">> Deploy Solr seach module in remote host... [11/13]"
ssh $USER@$HOST docker run -d \
                -p $NEURONE_SOLR_PORT:8983 \
                --name $NEURONE_SOLR_NAME \
                --restart=unless-stopped \
                solr solr-create -c $NEURONE_SOLR_CORE

echo ">> Deploy offline NEURONE image in remote host... [12/13]"
ssh $USER@$HOST docker run -d \
                -e ROOT_URL="http://$HOST" \
                -e MONGO_URL="mongodb://$NEURONE_DB_USER:$NEURONE_DB_PASS@$NEURONE_DB_NAME:$NEURONE_DB_PORT/$NEURONE_MONGO_DATABASE" \
                -e NEURONE_SOLR_HOST=$NEURONE_SOLR_NAME \
                -e NEURONE_SOLR_PORT=$NEURONE_SOLR_PORT \
                -e NEURONE_SOLR_CORE=$NEURONE_SOLR_CORE \
                -e DISABLE_WEBSOCKETS=0 \
                -p $NEURONE_APP_PORT:80 \
                -v $NEURONE_ASSET_PATH:/assets \
                --link $NEURONE_DB_NAME:mongo \
                --link $NEURONE_SOLR_NAME:solr \
                --name $NEURONE_APP_NAME \
                --restart=unless-stopped \
                dgacitua/neurone

ssh $USER@$HOST docker run -d \
                -e ROOT_URL="http://$HOST" \
                -e MONGO_URL="mongodb://$NEURONE_DB_USER:$NEURONE_DB_PASS@$NEURONE_DB_NAME:$NEURONE_DB_PORT/$NEURONE_MONGO_DATABASE" \
                -e NEURONE_SOLR_HOST=$NEURONE_SOLR_NAME \
                -e NEURONE_SOLR_PORT=$NEURONE_SOLR_PORT \
                -e NEURONE_SOLR_CORE=$NEURONE_SOLR_CORE \
                -e DISABLE_WEBSOCKETS=1 \
                -p 81:80 \
                -v $NEURONE_ASSET_PATH:/assets \
                --link $NEURONE_DB_NAME:mongo \
                --link $NEURONE_SOLR_NAME:solr \
                --name $NEURONE_AJAX_NAME \
                --restart=unless-stopped \
                dgacitua/neurone


echo ">> Deploy to local server is ready! [13/13]"
set +u
set +e