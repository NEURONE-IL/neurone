#!/bin/bash
set -e

### Configuration ###

USER=$PASSENGER_SERVER_USERNAME
HOST=$PASSENGER_SERVER_HOST
SERVER=$USER@$HOST
APP_DIR=/var/www/neurone
KEYFILE=
REMOTE_SCRIPT_PATH=/tmp/deploy-neurone.sh


### Library ###

function run()
{
  echo "Running: $@"
  "$@"
}


### Automation steps ###

if [[ "$KEYFILE" != "" ]]; then
  KEYARG="-i $KEYFILE"
else
  KEYARG=
fi

run meteor bundle neuroneapp.tar.gz
run scp $KEYARG neuroneapp.tar.gz $SERVER:$APP_DIR/
run scp $KEYARG passenger/work.sh $SERVER:$REMOTE_SCRIPT_PATH
echo
echo "---- Running deployment script on remote server ----"
run ssh $KEYARG $SERVER bash $REMOTE_SCRIPT_PATH
