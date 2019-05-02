FROM node:12.2.0-alpine

ENV APP_PATH=/nodesample

WORKDIR $APP_PATH

COPY package*.json ./

RUN apk --no-cache add --virtual builds-deps build-base python \
  && npm i \
  && apk del builds-deps build-base python

COPY . .

CMD [ "npm", "start" ]
