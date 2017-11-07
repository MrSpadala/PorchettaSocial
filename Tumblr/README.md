# il file tumblr_api.py scrive su tumblr post per conto di terzi


#funzionamento

- il metodo utilizzato è lo stesso di quello utilizzato per twitter in quanto tumblr utilizza oauth1.0

- se non lo si conosce andare nella cartella twitter e studiare la linkografia messa a disposizione

-le differenze con twitter sono:
	l'oauth_verifier che per twitter corrispondeva al pin è qua invece nel lnk di reindirzzamento
	quindi dopo aver autorizzato l'app la console vi chiederà l'url al quale siete stati reindirizzati
	e su quello effettuerà un parsing per ottenere l'oauth_verifier
	
	altra differenza è che il link che tumblr mette a disposizione per poter postare richiede un 
	blog-id che corisponde al nome dell'utente, quindi ho fatto in modo tale che prima effettuo una get per
	sapere il nome dell'utente e successivamente si possono creare i post sulla sua 'bacheca'

	ah e la risposta 201 che da in realtà significa che è stato postato correttamente solo quello

#linkografia

link per le api di tumblr

- https://www.tumblr.com/docs/en/api/v2

