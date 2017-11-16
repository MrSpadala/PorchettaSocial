
// per ora senza autenticazione, un client si connette al sito, scrive 
// il post che vuole fare e lo manda al server attraverso una POST


// importo i moduli locali
var auth = require('./auth.js')
var queue = require('./queues.js')
var globals = require('./globals.js')
var req_list = globals.req_list
var log = globals.log


// load and configuring libraries
// bodyParser mi serve per parsare la POST
var bodyParser = require('body-parser')
var c00kies = require('cookie-parser')
var express = require('express')
var fs = require('fs')
var app = express()
var server = null
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(c00kies())

// risposta nell'URL root alla get (home page)
app.get('/', function (req, res) {
  globals.increase_req_id()
  log('Received a GET')
  
  // testing
  console.log("Cookies: ", req.cookies)
  res.cookie('er_manz', 'stupido')

  res.send('<html>SCEEMOOOO!<br>Fammi una POST</html>')
})


// testing
app.get('/test_ws', function(req, res) {
  res.sendFile(__dirname + '/test.html')
})


/* User POSTs when he wants to upload a post
 *
 * The body of the POST made by the user has two keys:
 *   'data' = text of the post 
 *   'list' = list of social networks. Values are described in RPC_FORMAT.md, so 
 *            facebook has 'fb', twitter has 'twt' and so on
 */
 
 // UPDATE - LEGGI
 // list non c'è più e ci sono attributi "twt": true/flase "tmb":true/false etc
 
app.post('/', function (req, res) {
  globals.increase_req_id()
  
  var text = req.body.data
 
  // Build list from single fields
  var list = []
  if (req.body.twt) list.push('twt')
  if (req.body.tmb) list.push('tmb')
  // etc..etc.. add modules
  
  log('Received text:'+text+' list:'+list)

  // sanity check, list and text can't be undefined
  if (typeof(text) == 'undefined' || typeof(list) == 'undefined') {
    res.status(400)   //bad request
    res.send({result:'no', msg:"The received POST didn't have correct parameters in the body"})
    return
  }

  text = text.trim()   //removing leading and trailing spaces
  
  // sanity check, filter all social not listed in RPC_FORMAT.md
  //list = list.filter(function(e){ return !e in ['fb','twt','g+','tmb'] })

  // sanity check, if list is empty i don't publish on any social network
  if (list.length == 0) {
    res.send({result:'no', msg:'no social selected'})
    return
  }

  // sanity check, if user post contains utf char '\xFF' 'ÿ', substitute the 'ÿ' with a 'y'
  text = text.replace(new RegExp('\xFF', 'g'), 'y')
 
  
  // C00kies sanity checks
  cookie = req.cookies.porkett
  var need_auth = []
  list.forEach( function(network) {
    if (typeof(cookie)=='undefined' || !network in cookie.logged)
      need_auth.push(network)
  })
  
  // If cookie fails sanity check
  if (need_auth.length > 0) {
    res.send({result:"no", auth:need_auth})
    return
  }


  var token1 = []
  var token2 = []
  list.forEach( function(network) {
    try {
      token1.push(cookie[network].token1)
      token2.push(cookie[network].token2)
    } catch (ex) {
      res.send({result:"no", auth:[network]})
      return
    }
  })

  // if the program is here we have a token, proceed to upload post
  // (Following RPC syntax in RPC_FORMAT.md)
  for (var i=0; i<list.length; i++) {
    var msg = ['upload_post', text, token1[i], token2[i]].join('\xFF')
	queue.send(msg, list[i])
  }

  res.send({result:"yes", msg:"forwarded to "+list})
})




/* token that will be used to verify pin are saved in req_list. token1 and token2 are URLencoded
 *
 *       Cookie:
 *   twt: 
 *   {
 *      token1: 'token1'   
 *      token2: 'token2'
 *   }
 */
app.get('/auth/start/twitter', function(req, res) {
  auth.start('twt', req, res)
})



app.get('/auth/landing/twitter', function(req, res) {
  auth.oauth_landing('twt', 'twitter', req, res)
})
 
 
/* After a successful auth the server register access tokens in cookies. 
 *   request body:
 *   {
 *      token1: 'token1',
 *      token2: 'token2'
 *   }
 *
 *   Cookie:
 *   {
 *      social: 'nome-social'   #id del social dove ci si è autenticati
 *      token1: 'token1'   
 *      token2: 'token2'
 *   }
*/
app.post('/register_access/twitter', function(req, res){
  auth.register_access('twt', req, res)
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
