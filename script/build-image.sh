#!/usr/bin/env bash

workspace=$(dirname $0)/..
imageRef=lokomotes/station-node:latest

cd $workspace

tar --exclude='**/*.ts' -cvf base.tar \
    dist package.json package-lock.json Dockerfile

cat base.tar | docker build - -t $imageRef

rm base.tar