FROM node:14-slim

WORKDIR /usr/src/app

COPY Backend/package*.json ./

RUN npm install

COPY Backend/. /usr/src/app/Backend/

EXPOSE 3000

CMD [ "node", "Backend/app.js" ]
