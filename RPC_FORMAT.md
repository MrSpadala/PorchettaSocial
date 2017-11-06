
# Scambio di messaggi tra il server e i moduli dei social network
Qui definiamo come devono essere formattati i messagi.
Il server principale comunica delle funzioni (RPC) da far eseguire ai moduli delle API, questi risponderanno al server comunicandogli il risultato, o i risultati. __Le funzioni riportate qui sotto devono essere implementate da ogni modulo delle API.__ 
 
- Ad ogni messaggio viene assegnato un identificativo univoco dal server principale. Quando la richiesta del server è stata eseguita, l'identificativo dovrà essre ritornato al server come è descritto sotto




### Messaggi dal Server ai Moduli API
Com'è formattata la stringa che riceveranno i client API. __La barra `|` indica un byte pari a 0xFF__, che funge da flag che separa i campi.

	
	__Formato richiesta__  `  id_richiesta | comando | param_1 | param_2 | ...  `

 
 + Il numero dei parametri è variabile, dipende dal comando.

 + Per prendere i vari parametri si fa `messaggio.split('\xFF')` che restituisce una lista formata dai vari campi. Ad esempio se il messaggio è `123|auth|p1|p2|p3`, ritornerà `[123, auth, p1, p2, p3]` Funziona sia in Node che in Python.



 - `id_richiesta` è l'identificativo del messaggio, deve essere salvato e restituito nella risposta

 - `comando` è una stringa, rappresenta il comando che il server chiede di eseguire. Può essere:
	- `auth` richiede l'autenticazione al social network
	- `verify_pin` __solo per twitter__, conferma il pin da browser
	- `upload_post` carica un post

 - `param_i` sono i parametri delle RPC. Nel dettaglio:
	- `auth` non ha parametri 
	- `verify_pin` ha come unico parametro il pin da confermare, passato come stringa
	- `upload_post` ha come primo parametro il testo da postare, come secondo parametro l'access token dell'utente, come terzo parametro __solo per oauth1__ ha il secondo access token




### Messaggi dai Moduli API al Server
Come prima, la barra indica il flag


	__Formato risposta__  `  id_api | id_richiesta | comando | res_1 | res_2 | ...  `


 + Il numero dei risultati p variabile, dipende dal comando.

 + Per formattare i vari campi sotto forma di stringa con le flag al posto giusto si fa
	`[campo1, campo2, ...].join('\xFF')` Funziona in Node e _non_ in Python


 - `id_api` è l'identificativo del modulo delle api:
	- twitter    `twt`
	- googlePlus `g+`
	- facebook   `fb`

 - `id_richiesta` è lo stesso id ricevuto dal server

 - `comando` è da definire

 - `res_i` sono da definire



