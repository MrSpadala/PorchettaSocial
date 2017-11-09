# Twitter

Il file twitter_api.py garantisce l'autenticazione e autorizzazione di un utente per permettere a PorchettaSocial di pubblicare post 
Il file queue_twt.py invece è un esempio di gestione delle code lato APIs. esso dovrà essere implentato e integrato con il file twitter_api.py per gestire le varie richieste lato server seguendo le direttive del file RPC_FORMAT.md che si trova nella cartella principale
il server userà il modulo queue_twt.py

## Run twitter_api.py
Prende in input da terminale e posta su twitter. __E' necessario avere un account__
 - run on Docker: montare l'immagine e farla partire
	```
	sudo docker build -t twitter . && sudo docker run --rm -it twitter
	```

 - run on python: `python3 twitter_api.py` va bene sia python che python3, installare prima le librerie contenute in dependencies

## Come funziona twitter_api.py

- effettua un' atenticazione da parte della nostra app registrata su twitter come PorchettaSocial

- ad autenticazione effettuata vengono tornati indietro due token necessari ad ottenere l'url di autorizzazione che serve a PorchettaSocial

- su quell'url l'utente segna il proprio account twitter e autorizza PorchettaSocial a fare quello che deve fare

- si apre per l'utente una pagina che torna un pin che dovrà mettere in questo caso nella console, poi vedremo dove, e che serve al fine di 
ottenere la 'session' che in python corrisponde ad un oggetto sul quale è memorizzato il token
del nostro utente per fare richieste. 

- dalla session si possono fare richieste di tipo get o post. il primo parametro è preso da questa pagina: 'https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/post-statuses-update'
 il secondo parametro, sono il corpo della richiesta e stando alla documentazione presente nella pagina precedentemente linkata
 lo "status" corrisponde al messaggio del tweet

## Come funziona queue_twt.py

- il file queue_twt.py implementa un esempio di comunicazione tramite code con il server hostato in locale

- esso una volta fatto partire rimane in ascolto aspettando che il server di rabbitmq gli mandi qualcosa sulla coda twt

- a ricezione del messaggio fa un parsing dello stesso e, a seconda dei parametri definiti nel messaggio (guardare RPC_FORMAT.md), invia i seguenti messaggi:
	
	- msg_id flag twt flag auth flag authorize_url flag request_token flag request_token_secret 

	nel caso gli venga richiesto tramite il comando auth l'url al quale indirizzare l'utente per dare i permessi
	in tal caso il server dovra tenersi gli ultimi 3 parametri

	- msg_id flag twt flag verify_pin flag token1 flag token2

	nel caso gli venga richiesto di verificare il pin ed esso è corretto.

	- msg_id flag twt flag verify_pin flag DIOCAN

	nel caso gli venga richiesto di verificare il pin ed esso non  corretto

	- msg_id flag twt flag upload_post flag 1

	nel caso gli venga richiesto di postare un tweet, ma non ha successo l'operazione

	- msg_id flag twt flag upload_post flag 0

	nel caso gli venga richiesto di postare un tweet, ed ha successo l'operazione

io propongo di spostare l'autenticazione quindi l'url e la verifica del pin nella parte server per rendere il tutto più efficiente.
una cosa del tipo quando gli serve l'url o il pin, il server anzichè metterlo in coda chiama il modulo python che si troverà nella
stessa cartella del file del server e gli restituirà quello che gli deve restituire. anzichè mettere in coda la richiesta aspettare
che il modulo la piji e riinviare, calcolando che nella realtà solitamente se si crea un'architettura del genere il modulo api 
e il server hostano su due server diversi quindi il tutto è molto poco efficiente.


il modulo in questione non è stato ancora testato, sono stati testati i pezzi di codice che lo compongono avviando rabbit mq al volo quindi
è tutto da testare

### Come continuare l'implementazione:

-il file twitter_api.py dovrà essere integrato con queue_twt.py
 
 
### Implementazione come pagina web

- da definire

## linkografia:

Documentazione twitter per creare un tweet:
	
-https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/post-statuses-update

Come lavora la libreria reauth dietro a quelle poche righe di codice di twitter.py:

-https://techrangers.cdl.ucf.edu/oauth-python-tutorial.php

Documentazione di Oauth in python a grandi linee:

-http://rauth.readthedocs.io/en/latest/api/#rauth.OAuth1Service
