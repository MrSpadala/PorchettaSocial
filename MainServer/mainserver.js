
// per ora senza autenticazione, un client si connette al sito, scrive 
// il post che vuole fare e lo manda al server attraverso una POST

var PORT = 8080

var DEBUG = true


// load and configuring libraries
var bodyParser = require('body-parser')
var app = require('express')()
// configuro express affinche' usi il modulo body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))



// risposta nell'URL root alla get (home page)
app.get('/', function (req, res) {
  res.send('<html>SCEEMOOOO!<br>Fammi una POST mettendo una chiave \'data\'</html>')
})

// risposta alla post di un utente
// MESSAGGIO DELLA POST: una sola variabile, contenente il testo del post
app.post('/', function (req, res) {
  var text = req.body.data
  if (DEBUG)
	console.log('[DEBUG] t='+(new Date).getTime()+' mainserver received: '+text)
  
  // handle here

  res.send('<html>rieccoti scemo, hai postato '+text+'</html>')
})



// listen on PORT
app.listen(PORT, function () {
  console.log('mainserver listening on port '+PORT)
})
