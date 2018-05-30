#!/bin/bash

set -e

# Build API
npm install
npm run lint
npm run build

cp -R $PROJECT_DIR/node_modules $PACKAGING_FILES
cp -R $PROJECT_DIR/dist-api $PACKAGING_FILES
cp -R $PROJECT_DIR/src-playbooks $PACKAGING_FILES
