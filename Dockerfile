FROM circleci/node:latest-browsers

WORKDIR /usr/src/app

RUN sudo npm install -g @angular/cli 

COPY Backend/. /usr/src/app/Backend/
COPY Frontend/. /usr/src/app/Frontend/
COPY start.sh/. /usr/src/app/
COPY package.json/. /usr/src/app/

# CMD ["cd", "~"]
# RUN sudo npm install -f
# CMD ["npm", "install", "-f"]
EXPOSE 4200
CMD ["sh","./start.sh"]
