# Scambio di messaggi tra il server e i moduli dei social network
Qui definiamo come devono essere formattati i messagi.
Il server principale comunica delle funzioni (RPC) da far eseguire ai moduli delle API, questi risponderanno 
al server comunicandogli il risultato, o i risultati. __Le funzioni riportate qui sotto devono essere implementate da ogni modulo delle API.__ 
 
- Ad ogni messaggio viene assegnato un identificativo univoco dal server principale. Quando la richiesta del server è stata eseguita, 
  l'identificativo dovrà essre ritornato al server nel momento in cui il messaggio viene inviato nella coda di ritorno




### Messaggi dal Server ai Moduli API
Com'è formattata la stringa che riceveranno i client API. __La barra `|` indica un byte pari a 0xFF__, che funge da flag che separa i campi.

	
   __Formato richiesta__  `  msg_id | comando | param_1 | param_2 | ...  `

 
 + Il numero dei parametri è variabile, dipende dal comando.

 + Per prendere i vari parametri si fa `messaggio.split('\xFF')` che restituisce una lista formata dai vari campi. 
   Ad esempio se il messaggio è `msg_id|cmd|p1|p2|p3`, ritornerà `[msg_id, cmd, p1, p2, p3]` Funziona sia in Node che in Python.


 - `msg_id` è una stringa ottenuta con toString dalla variabile globale numerica msg_id che assegna un identificatore univoco ad ogni richiesta.

 - `comando` è una stringa, rappresenta il comando che il server chiede di eseguire. Può essere:
	- `auth` richiede l'autenticazione al social network
	- `verify_pin` conferma il pin
	- `upload_post` carica un post
	- `upload_post` carica una foto (In un primo momento, eventualemte si può modficare con un media qualsiasi)

 - `param_i` sono i parametri delle RPC. Nel dettaglio:
	- `auth` non ha parametri 
	- `verify_pin` ha come unico parametro il pin da confermare, passato come stringa
	- `upload_post` ha come primo parametro l'access token, come secondo il secondo access token, come terzo il testo del post, come quarto (__opzionale__) l'immagine da postare 



### Messaggi dai Moduli API al Server
Come prima, la barra indica il flag


   __Formato risposta__  `  msg_id | id_api | comando | res_1 | res_2 | ...  `


 + Il numero dei risultati p variabile, dipende dal comando.

 + Per formattare i vari campi sotto forma di stringa con le flag al posto giusto si fa
	`[campo1, campo2, ...].join('\xFF')` Funziona in Node e _non_ in Python



 - `id_api` è l'identificativo del modulo delle api:
	- twitter    `twt`
	- googlePlus `g+`
	- facebook   `fb`
	- tumblr     `tmb`
	- flickr 	 `fkr`

 - `comando` è da definire

 - `res_i` sono da definire

+ Nei moduli API l'invio dei messaggi di risposta al server tramite l'apposita coda viene 
fatto automaticamente dalla sendToQueue: nella funzione ci sarà lo spazio per l'invio 
tramite api e subito l'inoltro della risposta alla coda 'to_server'.  


