#!/bin/sh

NEURONE_ROOT_URL=$NEURONE_REMOTE_URL
NEURONE_MONGO_DATABASE="neurone"

NEURONE_APP_NAME="neurone-app"
NEURONE_APP_PORT=80

NEURONE_DB_NAME="neurone-db"
NEURONE_DB_PORT=27017

NEURONE_ASSET_PATH=$NEURONE_REMOTE_ASSETS
NEURONE_DB_PATH=$NEURONE_REMOTE_DB

docker run -d \
  -p $NEURONE_ROOT_URL:$NEURONE_DB_PORT:27017 \
  -v $NEURONE_DB_PATH:/data/db \
  --name $NEURONE_DB_NAME  \
  --restart=unless-stopped \
  mongo

docker run -d \
  -e ROOT_URL="http://$NEURONE_ROOT_URL" \
  -e MONGO_URL="mongodb://$NEURONE_DB_NAME:$NEURONE_DB_PORT/$NEURONE_DB_DATABASE" \
  -p $NEURONE_APP_PORT:80 \
  -v $NEURONE_ASSET_PATH:/assets \
  --link $NEURONE_DB_NAME:mongo \
  --name $NEURONE_APP_NAME \
  --restart=unless-stopped \
  dgacitua/neurone