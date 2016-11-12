#!/bin/sh

NEURONE_ROOT_URL=$NEURONE_REMOTE_URL
NEURONE_MONGO_DATABASE="neurone"

NEURONE_APP_NAME="neurone-app"
NEURONE_APP_PORT=80

NEURONE_DB_NAME="neurone-db"
NEURONE_DB_PORT=27017
NEURONE_DB_USER=$NEURONE_USER
NEURONE_DB_PASS=$NEURONE_PASS

NEURONE_ASSET_PATH=$NEURONE_REMOTE_ASSETS
NEURONE_DB_PATH=$NEURONE_REMOTE_DB

docker run -d \
  -p $NEURONE_DB_PORT:27017 \
  -v $NEURONE_DB_PATH:/data/db \
  --name $NEURONE_DB_NAME  \
  --restart=unless-stopped \
  mongo --auth

docker exec -it $NEURONE_DB_NAME mongo admin --eval "db.createUser({ user: \"$NEURONE_DB_USER\", pwd: \"$NEURONE_DB_PASS\", roles: [{ role: \"userAdminAnyDatabase\", db: \"admin\" }]})"

docker run -d \
  -e ROOT_URL="http://$NEURONE_ROOT_URL" \
  -e MONGO_URL="mongodb://$NEURONE_DB_USER:$NEURONE_DB_PASS@$NEURONE_DB_NAME:$NEURONE_DB_PORT/$NEURONE_MONGO_DATABASE" \
  -p $NEURONE_APP_PORT:80 \
  -v $NEURONE_ASSET_PATH:/assets \
  --link $NEURONE_DB_NAME:mongo \
  --name $NEURONE_APP_NAME \
  --restart=unless-stopped \
  dgacitua/neurone