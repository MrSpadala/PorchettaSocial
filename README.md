 <p align="center">
  <img src="https://raw.githubusercontent.com/MrSpadala/PorchettaSocial/master/MainServer/res/porchetta_logo.png" alt="logo">
</p>

# PorchettaSocial
PorchettaSocial è un'applicazione web che consente all'utente di loggarsi in modo protetto sui social <a href="https://github.com/MrSpadala/PorchettaSocial/tree/master/Flickr">Flickr</a>, <a href="https://github.com/MrSpadala/PorchettaSocial/tree/master/Tumblr">Tumblr</a> e <a href="https://github.com/MrSpadala/PorchettaSocial/tree/master/Twitter">Twitter</a> e pubblicare immagini o post testuali simultaneamente su tutti i social da lui desiderati. 
La pagina web cui l'utente si connette e che fornisce il servizio è <a href="https://github.com/MrSpadala/PorchettaSocial/blob/master/MainServer/res/porchetta_website.html">PorchettaSocial</a>.

### Architecture Layout

<p align="center">
   <img src="https://raw.githubusercontent.com/MrSpadala/PorchettaSocial/master/Diagram.jpg" alt="Architectur image">
</p>

### Prerequisites and Installing

Inseriamo qua che cosa deve digitare etc etc 

### Authors

- Nicolanti Valerio
- Roggiolani Giulia
- Spadaccino Pietro
- Terenzi Francesco
- Viviano Riccardo

### License

Il progetto è sotto la Licensa MIT: <a href="https://github.com/MrSpadala/PorchettaSocial/blob/master/LICENSE">License Document</a>.

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
