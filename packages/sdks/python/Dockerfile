FROM node:23-alpine

RUN apk update

RUN apk add --no-cache bash

RUN apk add --no-cache openjdk11-jre

RUN npm install -g @openapitools/openapi-generator-cli

WORKDIR /sdk
