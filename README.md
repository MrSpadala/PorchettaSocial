![alt text](https://raw.githubusercontent.com/MrSpadala/PorchettaSocial/master/res/porchetta_logo.png "release_the_porcone")
# PorchettaSocial
porchetta is coming...

### Layout
Architettura di riferimento: https://image.ibb.co/gnWtFw/index.jpg

![alt text](https://raw.githubusercontent.com/MrSpadala/PorchettaSocial/master/Diagram.jpg)

### Creare app Javascript
 - Cerchiamo di dockerizzare il più possibile, in modo che non ci si riempia il pc di spazzatura inutile. Così facendo gli unici programmi da installare sono [Docker](https://docs.docker.com/engine/installation/) e [NodeJS con npm incluso](https://nodejs.org/en/download/)
 
  - Seguire più o meno questo procedimento per mantenere una certa consistenza tra tutti i moduli:
    1. Creare una cartella per la nuova app
    2. Fare `npm init` per inizializzare componenti di Node. Il risultato verrà salvato nel file `package.json`
    3. Per aggiungere librerie esterne usare `npm install --save nome-lib`. Le librerie aggiunte vanno nel 
    `package.json` sotto il campo dependencies
    4. Rendere l'app dockerizzabile scrivendo il `Dockerfile`. Un esempio di Dockerfile:
      ```
      FROM node:9               # versione di NodeJS
      WORKDIR /app              # imposta la directory corrente nell'immagine Docker
      COPY package.json /app    # copia il package.json nella cartella /app
      RUN npm install           # installa dentro l'immagine le librerie necessarie elencate in package.json
      COPY . /app               # copia tutto il resto della directory (codice, ecc...) dentro /app
      CMD node <file>.js        # comando di avvio del container
      ```
    5. Scrivere il file `README.md` 
      
#### Logo copyright
Icon made by [Freepik](https://www.freepik.com/) from www.flaticon.com
