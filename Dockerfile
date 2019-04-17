FROM node:10.15.3-alpine

ENV APP_PATH=/nodesample

RUN mkdir -p $APP_PATH
WORKDIR $APP_PATH

COPY package*.json ./

# Install required package for compiling bcrypt and then remove
RUN apk --no-cache add --virtual builds-deps build-base python \
  && npm i \
  && apk del builds-deps build-base python

RUN cp -rf node_modules /tmp
COPY . .

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000

CMD [ "npm", "start" ]
