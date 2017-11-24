# Tumblr
Il file queue_tmb.py è un esempio di gestione delle code lato APIs. esso serve per gestire le varie richieste lato server come creazione di post solo testo o creazione di post con allegate le immagini seguendo le direttive del file RPC_FORMAT.md che si trova nella cartella principale.

Il file tumblr_authentication_websocket.py gestisce l'autenticazione dell'user su tumblr connettendosi
tramite websocket direttamente con l'utente finale senza passare per il nostro server


## Come funziona queue_tmb.py

- il file queue_twt.py implementa un esempio di comunicazione tramite code con il server hostato in locale

- esso una volta fatto partire rimane in ascolto aspettando che gli venga mandato qualcosa sulla coda twt

- a ricezione del messaggio fa un parsing dello stesso e, a seconda dei parametri definiti nel messaggio (guardare RPC_FORMAT.md), invia i seguenti messaggi:


	- msg_id flag twt flag upload_post flag 0

	nel caso gli venga richiesto di postare un tweet, ed ha successo l'operazione

	- msg_id flag twt flag upload_post flag exception_occurred

	nel caso non si può creare l'oggetto sessione e quindi i token non valgono più e tocca richiedere l'autenticazione e l'operazione non ha successo

	con flag = ÿ

# Come funziona tumblr_authentication_websocket.py:
	
	tenendo conto che si è mantenuta la semantica dei messaggi delle code e visto che il server websocket del file python
	deve gestire l'autenticazione, che comprende invio dell'url all utente finale e verifica della correttezza
	dell'inserimento del pin di conferma (o meglio definito come oauth_verifier), i messaggi che riceve sono:
	
	- auth
	
	- verify_pin flag pin flag token1 flag token2
	
	con flag = ÿ
	
	al primo messaggio twitter_authentication_websocket.py risponde così:
	
	- tmb flag auth flag authorize_url flag request_token flag request_token_secret
	
	al secondo risponderà così:
	
	- tmb flag verify_pin flag token1 flag token2 
	
	

## Linkografia :
Come lavora la libreria reauth dietro a quelle poche righe di codice di twitter.py:

- https://techrangers.cdl.ucf.edu/oauth-python-tutorial.php

Documentazione di Oauth in python a grandi linee:

- http://rauth.readthedocs.io/en/latest/api/#rauth.OAuth1Service

Documentazione per il file python che gestisce il lato server websocket:

- http://websockets.readthedocs.io/en/stable/intro.html

Api di Tumblr

- https://www.tumblr.com/docs/en/api/v2

RabbitMQ

- https://www.rabbitmq.com/getstarted.html



