#!/bin/bash

export LC_ALL=C.UTF-8

export NEURONE_ASSET_PATH=$(cd ../assets; pwd)
export NEURONE_SOLR_HOST="127.0.0.1"
export NEURONE_SOLR_PORT="8983"
export NEURONE_SOLR_CORE="neurone"

meteor
