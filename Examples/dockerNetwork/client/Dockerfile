 # versione di NodeJs
FROM node:9

WORKDIR /app

 # copia il codice e installa le librerie elencate in package.json
COPY package.json /app
RUN npm install
COPY . /app

 # comando di avvio
CMD node index.js
