
### Prova di un'app Nodejs che gira su Docker


### Run
 - spostarsi col terminale in questa cartella
 - montare l'immagine con 'sudo docker build -t hello-dock .'
 - farla partire in un container con 'sudo docker run -p 80:8081 hello-dock'
ora ci si può accedere da browser con localhost:80


creando la prima app docker+node seguendo questo tutorial:
 https://buddy.works/guides/how-dockerize-node-application



per installare l'ultima versione di node e npm:
 curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
 sudo apt-get install -y nodejs

