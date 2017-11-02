 # versione di NodeJs
FROM node:9

WORKDIR /app

 # copia il codice e installa le librerie elencate in package.json
COPY package.json /app
RUN npm install
COPY . /app

 # comando di avvio
CMD node mainserver.js

 # porta esposta
 # ATTENZIONE deve essere uguale a 'PORT' nel mainserver.js, sennò non funzia un cazzo
EXPOSE 8080
