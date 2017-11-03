# Main Server

Comunica con i client ed è il punto di snodo tra le varie componenti

## Run
 - per farlo runnare su docker
	```
	sudo docker build -t mainserver .
	sudo docker run --rm -p 80:8080 mainserver
	```

 - per farlo runnare velocemente
	```
	node mainserver.js
	```
   
   Se lo si vuole runnare così bisogna avere installato nodejs, npm e tutte le
   librerie elencate dentro al file ```package.json``` sotto il campo ```"dependencies"```,
   con ```npm install --save nome-libreria```
