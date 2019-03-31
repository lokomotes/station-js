FROM node:lts-alpine

WORKDIR /usr/station

ADD . .

RUN npm install --production

ENTRYPOINT [ "npm", "start" ]