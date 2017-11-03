
### NodeJS + Docker
Prova di una semplice app in NodeJS che gira su Docker


## Run
 1. spostarsi col terminale in questa cartella
 2. montare l'immagine con ```sudo docker build -t hello-dock .```
 3. farla partire in un container con ```sudo docker run -p 80:8081 hello-dock```
ora ci si può accedere da browser con ```localhost:80```


creando la prima app docker+node seguendo questo tutorial:
 https://buddy.works/guides/how-dockerize-node-application



per installare l'ultima versione di node e npm:
 ```
 curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
 sudo apt-get install -y nodejs
 ```

