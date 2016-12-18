#!/bin/sh

export NEURONE_ASSET_PATH="/home/dgacitua/ProyectoTitulo/neuroneDocs"
export ROOT_URL="http://localhost"
MONGO_URL="mongodb://localhost:3001/meteor"

meteor build --architecture=os.linux.x86_64 ./.neuroneBuild --directory
cd ./.neuroneBuild/bundle
node server