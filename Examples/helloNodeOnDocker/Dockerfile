 # versione di NodeJs
FROM node:9

WORKDIR /app

 # installa le librerie elencate in package.json
COPY package.json /app
RUN npm install

COPY . /app

 # comando di avvio
CMD node helloworld.js

 # porta esposta
EXPOSE 8081
