FROM node:10.15.3-alpine

ENV APP_PATH=/nodesample

RUN mkdir -p $APP_PATH
WORKDIR $APP_PATH

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
