FROM node:14-slim

WORKDIR /usr/src/app

COPY Backend/package*.json ./

RUN npm install

COPY Backend/ .

CMD [ "node", "Backend/app.js" ]
