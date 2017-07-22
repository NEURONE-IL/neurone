#!/bin/bash

USER_NAME=${LOCAL_USER_NAME:-user}
USER_ID=${LOCAL_USER_ID:-9001}

printf "%b\n" "\e[1;31m>> Starting application with USER: $USER_NAME (UID: $USER_ID)\e[0m"
useradd --shell /bin/bash -u $USER_ID -o -c "" -m $USER_NAME
export HOME="/home/$USER_NAME"