
// per ora senza autenticazione, un client si connette al sito, scrive 
// il post che vuole fare e lo manda al server attraverso una POST


// importo i moduli locali
var queue = require('./queues.js')
var globals = require('./globals.js')
var log = globals.log


// load and configuring libraries
// bodyParser mi serve per parsare la POST
var bodyParser = require('body-parser')
var app = require('express')()
var server = null
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))



// risposta nell'URL root alla get (home page)
app.get('/', function (req, res) {
  globals.increase_req_id()
  log('Received a GET')

  res.send('<html>SCEEMOOOO!<br>Fammi una POST mettendo una chiave \'data\' nel body</html>')
})



/* User POSTs when he wants to upload a post
 *
 * The body of the POST made by the user has two keys:
 *   'data' = text of the post 
 *   'list' = list of social networks. Values are described in RPC_FORMAT.md, so 
 *            facebook has 'fb', twitter has 'twt' and so on
 */
app.post('/', function (req, res) {
  globals.increase_req_id()
  
  var text = req.body.data
  var list = req.body.list
  
  log('Received text:'+text+' list:'+list)

  // sanity check, if list is empty i don't publish on any social network
  if (list.length == 0) {
    res.send('no social selected')
    return
  }
  


  token = null
  token_oauth1 = null
  
  // TODO get user tokens from user cookies



  // if user doesn't have tokens stored in its cookies then authenticate.
  if (token == null) {
	
	// TODO OAuth logic here

  }


  // sanity check, if user post contains utf char '\xFF' 'ÿ', substitute the 'ÿ' with a 'y'
  text = text.replace(new RegExp('\xFF', 'g'), 'y')

  // if the program is here we have a token, proceed to upload post
  // (Following RPC syntax in RPC_FORMAT.md)
  var msg = ['upload_post', text, token, token_oauth1].join('\xFF')
  var id_list = queue.send(msg, list)

  // wait for the results of the rpc
  id_list.forEach(function(id) {
	
	var results = queue.recv(id)

	// TODO do something with the results

	log('RPC id:'+id+' Results: '+results)
  
  })

  res.send('ooook')
})



// register CTRL+C
process.on('SIGINT', function() {
  log('Received stop signal, halting')
  server.close()
  setTimeout(function() {process.exit()}, 500)  // give time to flush streams
})

// listen on port
server = app.listen(globals.port, function () {
  log('Started listening on port '+globals.port)
})
