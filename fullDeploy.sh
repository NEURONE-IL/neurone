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
NEURONE_APP_NAME="neurone-app"
NEURONE_APP_PORT=80
NEURONE_DB_NAME="neurone-db"
NEURONE_DB_PORT=27017


### BUILD START ###
echo ">> Bundle Meteor project... [1/12]"
meteor build --architecture=os.linux.x86_64 ./.neuroneBuild --directory

echo ">> Copying files for project... [2/12]"
cp Dockerfile ./.neuroneBuild/bundle
cp .dockerignore ./.neuroneBuild/bundle
cp .deploy/docker/meteor-env.conf ./.neuroneBuild/bundle
cp .deploy/docker/neurone.conf ./.neuroneBuild/bundle

echo ">> Building Docker image... [3/12]"
cd ./.neuroneBuild/bundle
docker build -t dgacitua/neurone .
cd ../..
rm -rf .neuroneBuild/


### DEPLOY START ###
echo ">> Creating offline image... [4/12]"
docker save -o neuroneimage.tar dgacitua/neurone 

echo ">> Copying files to remote host... [5/12]"
scp dockerDeploy.sh $USER@$HOST:$WORKDIR
scp neuroneimage.tar $USER@$HOST:$WORKDIR

echo ">> Removing local offline image... [6/12]"
rm neuroneimage.tar

echo ">> Removing old Docker app containers... [7/12]"
ssh $USER@$HOST "docker stop $NEURONE_DB_NAME || true && docker stop $NEURONE_APP_NAME || true"
ssh $USER@$HOST "docker rm $NEURONE_DB_NAME || true && docker rm $NEURONE_APP_NAME || true"

echo ">> Loading offline image in remote host... [8/12]"
ssh $USER@$HOST docker load -i $WORKDIR/neuroneimage.tar
ssh $USER@$HOST rm $WORKDIR/neuroneimage.tar

echo ">> Deploy MongoDB database in remote host... [9/12]"
ssh $USER@$HOST docker run -d \
                -p $NEURONE_DB_PORT:27017 \
                -v $NEURONE_DB_PATH:/data/db \
                --name $NEURONE_DB_NAME  \
                --restart=unless-stopped \
                mongo \
                mongod --auth

echo ">> Setting up authentication and databases in remote host... [10/12]"
ssh $USER@$HOST "docker exec -t $NEURONE_DB_NAME mongo admin --eval \\
                \"db.createUser({ user: \\\"admin\\\", pwd: \\\"$NEURONE_DB_PASS\\\", \\
                roles: [{ role: \\\"root\\\", db: \\\"admin\\\" }]})\" || true"

ssh $USER@$HOST "docker exec -t $NEURONE_DB_NAME mongo admin --eval \\
                \"db.createUser({ user: \\\"$NEURONE_DB_USER\\\", pwd: \\\"$NEURONE_DB_PASS\\\", \\
                roles: [{ role: \\\"readwrite\\\", db: \\\"$NEURONE_MONGO_DATABASE\\\" }]})\" || true"

echo ">> Deploy offline NEURONE image in remote host... [11/12]"
ssh $USER@$HOST docker run -d \
                -e ROOT_URL="http://$HOST" \
                -e MONGO_URL="mongodb://$NEURONE_DB_USER:$NEURONE_DB_PASS@$NEURONE_DB_NAME:$NEURONE_DB_PORT/$NEURONE_MONGO_DATABASE" \
                -p $NEURONE_APP_PORT:80 \
                -v $NEURONE_ASSET_PATH:/assets \
                --link $NEURONE_DB_NAME:mongo \
                --name $NEURONE_APP_NAME \
                --restart=unless-stopped \
                dgacitua/neurone

echo ">> Deploy to local server is ready! [12/12]"
set +u
set +e