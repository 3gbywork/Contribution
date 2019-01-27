#!/bin/bash/

jsFolder="./docs/js"
if [ ! -d "$jsFolder" ]; then
    mkdir "$jsFolder"
fi

cssFolder="./docs/css"
if [ ! -d "$cssFolder" ]; then
    mkdir "$cssFolder"
fi

cp ./src/js/*.min.js $jsFolder
cp ./src/css/*.min.css $cssFolder
cp ./src/contribution.html ./docs