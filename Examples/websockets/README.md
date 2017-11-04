# websockets
Programma di prova preso da https://www.npmjs.com/package/websocket

 - server: si mette in ascolto sulla porta 8080 e accetta i client che hanno specificato come protocollo 'my-protocol' (stringa)
 - client: si connette al server specificando lo stesso protocollo

#### Dependencies
	`npm install --save http websocket`

#### Run
	`node server.js` e in un altro terminale `node client.js`


