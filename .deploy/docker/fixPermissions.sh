#!/bin/bash

set -u
set -e

ASSET_DIR=$1
USER=$2
USER_ID=$(/sbin/setuser $USER bash -c "id -u")
GROUP_ID=$(/sbin/setuser $USER bash -c "id -g")

printf "%b\n" "\e[1;92m>> Fixing permissions on $ASSET_DIR as user $USER ($USER_ID:$GROUP_ID)\e[0m"

chown -R $USER_ID:$GROUP_ID $ASSET_DIR

cd $ASSET_DIR
find . -type d -exec chmod 755 {} +
find . -type f -exec chmod 666 {} +

set +e
set +u