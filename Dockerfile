FROM circleci/node:latest-browsers

WORKDIR /usr/src/app

RUN sudo npm install -g @angular/cli 

COPY Backend/. ~/Backend/
COPY Frontend/. ~/Frontend/
COPY start.sh/. ~
COPY package.json/. ~

# CMD ["cd", "~"]
# RUN sudo npm install -f
# CMD ["npm", "install", "-f"]
EXPOSE 4200
CMD ["sh","./start.sh"]
