FROM node:19

WORKDIR /usr/src/app

COPY ./package.json ./

RUN npm install

COPY ./server.js ./ 

EXPOSE 5000

CMD [ "node", "server.js" ] 