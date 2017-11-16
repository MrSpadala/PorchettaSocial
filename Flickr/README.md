# Flickr
Il file flickr_api.py garantisce l'autenticazione e autorizzazione di un utente per permettere a PorchettaSocial di pubblicare foto. 

## Run flickr_api.py
	i) Aprire il terminale (ctrl+alt+t)
	ii) Installare le seguenti librerie tramite il comando `pip3 install [nome_libreria]`
		- oauth2
		- requests
		- httplib2
		- urllib
	
	iii) digitare il comando `python3 flickr_api.py`
	
	---> A lavoro concluso girerà tutto su docker

## Come funziona flickr_api.py
	i) Effettua un' atenticazione da parte della nostra app registrata su Flickr come PorchettaSocial

	ii) Ad autenticazione effettuata vengono tornati indietro due token necessari ad ottenere l'url di autorizzazione che serve a PorchettaSocial

	iii) Sull'url di autorizzazione l'utente segna il proprio account twitter e autorizza PorchettaSocial a fare operazioni di scrittura

	iv) Si apre per l'utente l'home page di flick con il pin che che andrà inserito nella console. Ciò consente la creazione dell'access token. 

	v) Ottenuto l'access token si possono effetturare richieste HTTP di tipo 'GET' o 'POST'. Nell'esempio allegato si effettua una post e si attende 
		il reponso riguardo la pubblicazione di una determinata foto sul profilo utente. Il codice 200 indica un esito a buon fine.

### Implementazione come pagina web
-------- da definire -----------

## linkografia:
-------- da definire -----------
