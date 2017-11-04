# Il file twitter_api.py garantisce l'autenticazione e autorizzazione di un utente per permettere a PorchettaSocial di pubblicare post 


# Come funziona

-effettua un' atenticazione da parte della nostra app registrata su twitter come PorchettaSocial

-ad autenticazione effettuata vengono tornati indietro due token necessari ad ottenere l'url di autorizzazione che serve a PorchettaSocial

-su quell'url l'utente segna il proprio account twitter e autorizza PorchettaSocial a fare quello che deve fare

-si apre per l'utente una pagina che torna un pin che dovrà mettere in questo caso nella console, poi vedremo dove, e che serve al fine di 
ottenere la sessione token necessari a porchettasocial per fare commenti ecc ecc..

# Come continuare l'implementazione

-i token verrano spediti nelle code che implementeremo, nello stesso messaggio della coda verrà messo anche il post che vuole scrivere l'utente 	   da li si occuperà poi chi deve smistare i messaggi della coda a prendere i token e il messaggio e fare una POST sulla risorsa adatta 	   di twitter tramite quei parametri

# Implementazione come pagina web

- da definire

#il file ora se lo lanci e je dai l'autorizzazione con il tuo account te tweetta PORCOIDDDDIOOO poi lo modifico
