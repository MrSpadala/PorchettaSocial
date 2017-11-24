# Twitter
Il file queue_twt.py invece è un esempio di gestione delle code lato APIs. esso serve per gestire le varie richieste lato server come creazione di post solo testo o creazione di post con allegate le immagini seguendo le direttive del file RPC_FORMAT.md che si trova nella cartella principale
Il file twitter_authentication_websocket.py gestisce l'autenticazione dell'user su twitter connettendosi
tramite websocket direttamente con l'utente finale senza passare per il nostro server


## Come funziona queue_twt.py

- il file queue_twt.py implementa un esempio di comunicazione tramite code con il server hostato in locale

- esso una volta fatto partire rimane in ascolto aspettando che il server di rabbitmq gli mandi qualcosa sulla coda twt

- a ricezione del messaggio fa un parsing dello stesso e, a seconda dei parametri definiti nel messaggio (guardare RPC_FORMAT.md), invia i seguenti messaggi:


	- msg_id flag twt flag upload_post flag 0

	nel caso gli venga richiesto di postare un tweet, ed ha successo l'operazione

	- msg_id flag twt flag upload_post flag exception_occurred

	nel caso non si può creare l'oggetto sessione e quindi i token non valgono più e tocca richiedere l'autenticazione e l'operazione non ha successo

# Come funziona twitter_authentication_websocket.py:
	
	tenendo conto che si è mantenuta la semantica dei messaggi delle code e visto che il server websocket del file python
	deve gestire l'autenticazione, che comprende invio dell'url all utente finale e verifica della correttezza
	dell'inserimento del pin di conferma (o meglio definito come oauth_verifier), i messaggi che riceve sono del tipo:
	
	- auth
	
	- verify_pin flag pin flag token1 flag token2
	
	con flag = ÿ
	
	al primo messaggio twitter_authentication_websocket.py risponde così:
	
	- twt flag auth flag authorize_url flag request_token flag request_token_secret
	
	al secondo risponderà così:
	
	- twt flag verify_pin flag token1 flag token2 
 
## linkografia:

Documentazione twitter per creare un tweet:
	
- https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/post-statuses-update

Come lavora la libreria reauth dietro a quelle poche righe di codice di twitter.py:

- https://techrangers.cdl.ucf.edu/oauth-python-tutorial.php

Documentazione di Oauth in python a grandi linee:

- http://rauth.readthedocs.io/en/latest/api/#rauth.OAuth1Service

Documentazione per il file python che gestisce il lato server websocket:

- http://websockets.readthedocs.io/en/stable/intro.html
	
Documentazione dell'esempio test.html che gestisce il websocket lato client:

- https://www.tutorialspoint.com/html5/html5_websocket.htm

RabbitMQ

- https://www.rabbitmq.com/getstarted.html

