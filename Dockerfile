FROM node:10.15.3-alpine

ENV APP_PATH=/nodesample

RUN mkdir -p $APP_PATH
WORKDIR $APP_PATH

COPY package*.json ./

RUN apk --no-cache add --virtual builds-deps build-base python \
  && npm i \
  && apk del builds-deps build-base python

COPY . .

CMD [ "npm", "start" ]
