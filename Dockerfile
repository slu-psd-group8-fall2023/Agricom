FROM node:14-slim

WORKDIR /usr/src/app

COPY Frontend/package*.json ./

RUN npm install

COPY Frontend/. /usr/src/app/Frontend/

EXPOSE 4200

CMD [ "ng", "serve" ]