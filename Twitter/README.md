# Twitter
Il file twitter_api.py garantisce l'autenticazione e autorizzazione di un utente per permettere a PorchettaSocial di pubblicare post 

## Run
Prende in input da terminale e posta su twitter. __E' necessario avere un account__
 - run on Docker: montare l'immagine e farla partire
	```
	sudo docker build -t twitter . && sudo docker run --rm -it twitter
	```

 - run on python: `python3 twitter_api.py` va bene sia python che python3, installare prima le librerie contenute in dependencies

## Come funziona

- effettua un' atenticazione da parte della nostra app registrata su twitter come PorchettaSocial

- ad autenticazione effettuata vengono tornati indietro due token necessari ad ottenere l'url di autorizzazione che serve a PorchettaSocial

- su quell'url l'utente segna il proprio account twitter e autorizza PorchettaSocial a fare quello che deve fare

- si apre per l'utente una pagina che torna un pin che dovrà mettere in questo caso nella console, poi vedremo dove, e che serve al fine di 
ottenere la 'session' che in python corrisponde ad un oggetto sul quale è memorizzato il token
del nostro utente per fare richieste. 

- dalla session si possono fare richieste di tipo get o post. il primo parametro è preso da questa pagina: 'https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/post-statuses-update'
 il secondo parametro, sono il corpo della richiesta e stando alla documentazione presente nella pagina precedentemente linkata
 lo "status" corrisponde al messaggio del tweet

### come continuare l'implementazione:

-l'oggetto sessione verrà spedito nella coda anzichè spedire un token, oppure si può cercare di analizzare l'oggetto sessione
 così da spedire solo il token e ricostrurci l'oggetto sessione dall'altra parte poi vediamo
 
 
### Implementazione come pagina web

- da definire

## linkografia:

Documentazione twitter per creare un tweet:
	
-https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/post-statuses-update

Come lavora la libreria reauth dietro a quelle poche righe di codice di twitter.py:

-https://techrangers.cdl.ucf.edu/oauth-python-tutorial.php

Documentazione di Oauth in python a grandi linee:

-http://rauth.readthedocs.io/en/latest/api/#rauth.OAuth1Service
