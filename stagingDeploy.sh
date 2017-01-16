#!/bin/sh

# MAINTAINER: Daniel Gacitua <daniel.gacitua@usach.cl>

set -u
set -e

echo ">> Deploy to NEURONE (Websocket version) [1/3]"
(cd .deploy/neurone2-ws/ && pm2-meteor deploy)

echo ">> Deploy to NEURONE (AJAX version) [2/3]"
(cd .deploy/neurone2-ajax/ && pm2-meteor deploy)

echo ">> Deploy to local server is ready! [3/3]"

set +u
set +e