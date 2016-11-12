#!/bin/sh

# Set the following environment variables
# USER
# HOST
# PASS
# WORKDIR
# NEURONE_DB_USER
# NEURONE_DB_PASS
# NEURONE_DB_PATH
# NEURONE_ASSET_PATH

# Internal environment variables (do not modify if you don't know what you're doing)
NEURONE_MONGO_DATABASE="neurone"
NEURONE_APP_NAME="neurone-app"
NEURONE_APP_PORT=80
NEURONE_DB_NAME="neurone-db"
NEURONE_DB_PORT=27017


echo ">> Creating offline image..."
docker save dgacitua/neurone > neuroneimage.tar

echo ">> Copying files to remote host..."
sshpass -e scp dockerDeploy.sh $USER@$HOST:$WORKDIR
sshpass -e scp neuroneimage.tar $USER@$HOST:$WORKDIR

echo ">> Removing local offline image..."
rm neuroneimage.tar

echo ">> Loading offline image in remote host..."
sshpass -e ssh $USER@$HOST docker load < neurone-app.tar
sshpass -e ssh $USER@$HOST rm $WORKDIR/neuroneimage.tar

echo ">> Deploy MongoDB database in remote host..."
sshpass -e ssh $USER@$HOST docker run -d \
                -p $NEURONE_DB_PORT:27017 \
                -v $NEURONE_DB_PATH:/data/db \
                --name $NEURONE_DB_NAME  \
                --restart=unless-stopped \
                mongo --auth

echo ">> Setting authentication to database in remote host..."
sshpass -e ssh $USER@$HOST "docker exec -t $NEURONE_DB_NAME mongo admin --eval \\
                \"db.createUser({ user: \\\"$NEURONE_DB_USER\\\", pwd: \\\"$NEURONE_DB_PASS\\\", \\
                roles: [{ role: \\\"userAdminAnyDatabase\\\", db: \\\"admin\\\" }]})\""

echo ">> Deploy offline NEURONE image in remote host..."
sshpass -e ssh $USER@$HOST docker run -d \
                -e ROOT_URL="http://$HOST" \
                -e MONGO_URL="mongodb://$NEURONE_DB_USER:$NEURONE_DB_PASS@$NEURONE_DB_NAME:$NEURONE_DB_PORT/$NEURONE_MONGO_DATABASE" \
                -p $NEURONE_APP_PORT:80 \
                -v $NEURONE_ASSET_PATH:/assets \
                --link $NEURONE_DB_NAME:mongo \
                --name $NEURONE_APP_NAME \
                --restart=unless-stopped \
                dgacitua/neurone