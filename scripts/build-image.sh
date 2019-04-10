#!/usr/bin/env bash

workspace=$(dirname $0)/..
imageRef=lokomotes/station-nodejs:latest

cd $workspace/cargo

tar -cvf context.tar \
    * ../package.json ../package-lock.json ../Dockerfile

cat context.tar | docker build - -t $imageRef

rm context.tar
