
// per ora senza autenticazione, un client si connette al sito, scrive 
// il post che vuole fare e lo manda al server attraverso una POST


// importo i moduli locali
var globals = require('./globals.js')
var queue = require('./queues.js')


// load and configuring libraries
// bodyParser mi serve per parsare la POST
var bodyParser = require('body-parser')
var app = require('express')()
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
  if (globals.debug)
	console.log('[DEBUG] '+new Date+' mainserver received: '+text)
  
  // TODO get user tokens
  
  queue.send(text, 'my_access_token')

  res.send('<html>rieccoti scemo, hai postato '+text+'</html>')
})




// listen on port
app.listen(globals.port, function () {
  console.log('mainserver listening on port '+globals.port)
})
