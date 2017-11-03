# Echo server fra due container di Docker separati

Applicazione di prova per fare un collegamento tra due instanze di docker separate.
L'applicazione è un echo server, il codice è tutto dentro ai file client/index.js
e server/index.js


## Come funziona
Per far comunicare due container, c1 e c2, è necessario prima creare una rete virtuale
su Docker, a cui ci si connettono sia c1 che c2. Ora che i due container sono nella stessa
rete virtuale sono visibili tra di loro, e possono anche scambiarsi richieste http.
Se c1 vuole fare ad esempio una richiesta a c2, l'URL da specificare è http://nome-c2,
dove nome-c2 è il nome del container c2. Il nome del container viene dato quando si
fa partire il container così ```docker run ... --name=nome-c2 ...```

## Run
 1. Creare una rete virtuale a cui si connetteranno i due container
	```
	sudo docker network create test_net
	```
    Questo crea una nuova rete virtuale chiamata ```test_net```


 2. Montare le immagini docker del client e del server dandogli nomi con -t
	```
	sudo docker build -t server_test ./server/
	sudo docker build -t client_test ./client/
	```
 
 3. Avviare il container con l'immagine del server, con attenzione a collegarlo alla rete
	creata prima e a scegliere il nome del container
	```
	sudo docker run --rm --net=test_net --name=my-srvr server_test
	```
	
	Nello specifico, ```--rm``` fa in modo che una volta stoppato il container venga eliminato
	per non lasciare spazzatura, ```--net=test_net``` imposta che il container si connetta alla
	rete test_net precedentemente creata, ```--name=my-srvr``` è il nome del container.
	Importante: il nome del container e il nome del server dentro /client/index.js devono essere uguali.
	Infine ```server_test``` è il nome dell'immagine che avevamo montato.

	
 4. A questo punto in un altro terminale si può avviare il container del client
	```
	sudo docker run --rm --net=test_net --name=my-client -it client_test
	```

	Il nome del client si poteva omettere perchè non serviva al collegamento, invece
	l'opzione ```-it``` fa in modo che io possa inserire input da tastiera
