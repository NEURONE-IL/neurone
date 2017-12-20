#!/bin/bash

# Add local user
# Either use the LOCAL_USER_ID if passed in at runtime or fallback
# https://denibertovic.com/posts/handling-permissions-with-docker-volumes/

USER_NAME=${LOCAL_USER_NAME:-user}
USER_ID=${LOCAL_USER_ID:-9001}

exec /usr/local/bin/gosu $USER_NAME "$@"