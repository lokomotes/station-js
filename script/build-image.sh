#!/usr/bin/env bash

workspace=$(dirname $0)/..
imageRef=lokomotes/metro-station-node:latest

cd $workspace

tar --exclude='**/*.ts' -cvf base.tar \
    dist package.json package-lock.json Dockerfile

cat base.tar | docker build - -t metro-station-node8:latest

rm base.tar