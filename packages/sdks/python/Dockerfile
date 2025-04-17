FROM python:3.13-alpine

RUN apk update
RUN apk add --no-cache bash
RUN apk add --no-cache openjdk11-jre
RUN apk add --no-cache npm

RUN npm install -g @openapitools/openapi-generator-cli
RUN openapi-generator-cli version-manager set 7.12.0

WORKDIR /sdk
