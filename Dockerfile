FROM circleci/node:latest-browsers

WORKDIR /usr/src/app

RUN sudo npm install -g @angular/cli 

COPY ./Backend ./Backend
COPY ./Frontend ./Frontend
COPY ./start.sh .
COPY ./package.json .

CMD ["cd", "~"]
RUN sudo npm install -f
RUN sudo npm install socket.io --save --force
# CMD ["npm", "install", "-f"]
EXPOSE 8080
CMD ["sh","./start.sh"]
