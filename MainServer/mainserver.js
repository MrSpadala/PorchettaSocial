
// per ora senza autenticazione, un client si connette al sito, scrive 
// il post che vuole fare e lo manda al server attraverso una POST


// importo i moduli locali
var queue = require('./queues.js')
var globals = require('./globals.js')
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


  token = []
  token_oauth1 = []
  list.forEach( function(network) {
    switch (network) {
      case 'twt':{
        token.push(cookie.twt.token1)
        token_oauth1.push(cookie.twt.token2)
        break
      }
      default: res.send({result:"no", msg:'Get tokens from social '+network+' not implemented'}); return;
    }
  })

  // if the program is here we have a token, proceed to upload post
  // (Following RPC syntax in RPC_FORMAT.md)
  for (var i=0; i<list.length; i++) {
    var msg = ['upload_post', text, token[i], token_oauth1[i]].join('\xFF')
	queue.send(msg, list[i])
  }

  res.send({result:"yes", msg:"forwarded to "+list})
})




/* token that will be used to verify pin.
 *    token1 and token2 are URLencoded
 *
 *       Cookie:
 *   twt: 
 *   {
 *      token1: 'token1'   
 *      token2: 'token2'
 *   }
 */
app.get('/auth_request/twitter', function(req, res) {
  var t1 = req.query.token1
  var t2 = req.query.token2
  
  log('Saving request cookies for twitter authentication '+ [t1, t2])
  
  if (typeof(t1)=='undefined' || typeof(t2)=='undefined'){
    res.send({result:"no", msg:'Bad request body while saving twitter request tokens to cookies'})
    return
  }
  
  var cookie = req.cookies.porkett_auth
  if (typeof(cookie)=='undefined')
    cookie = {}
  
  cookie.twt = {}
  cookie.twt.token1 = t1
  cookie.twt.token2 = t2
  res.cookie('porkett_auth', cookie, { path: '/auth/twitter' })
  
  res.send({result:"yes", msg:'registered request cookies to twitter'})
})



/* twitter OAuth redirects here
 *
 */
app.get('/auth/twitter', function(req, res) {
  var pin = req.query.oauth_verifier
  
  log('Getting pin from cookies for twitter authentication '+ pin)
  
  if (typeof(pin)=='undefined'){
    res.send({result:"no", msg:'Bad request params while getting from URL'})
    return
  }
  
  var cookie = req.cookies.porkett_auth
  if (typeof(cookie)=='undefined' || typeof(cookie.twt)=='undefined' ||
      typeof(cookie.twt.token1)=='undefined' || typeof(cookie.twt.token2)=='undefined'){
    res.send({result:"no", msg:'Bad cookie while getting twitter request tokens'})
    return
  }
  
  var token1 = cookie.twt.token1
  var token2 = cookie.twt.token2
  
  // TODO send one auth_html to communicate to twitter api verifying pin, and posting tokens to /register_access
  fs.readFile('./html_auth/twitter.html', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace("<!--TOKEN_1-PLACEHOLDER-->", token1)
    result = result.replace("<!--TOKEN_2-PLACEHOLDER-->", token2)
    result = result.replace("<!--PIN-PLACEHOLDER-->", pin)
    res.send(result)
  })
})






/* After a successful auth the server register access tokens in cookies
 *   {
 *      social: 'nome-social'           #nome del social dove ci si è autenticati
 *      token1: 'token1'   
 *      token2: 'token2'
 *   }
*/
app.post('/register_access', function(req, res){
  var t1 = req.body.token1
  var t2 = req.body.token2
  var social = req.body.social

  log('Registering access with '+ [social, t1, t2])

  if (typeof(t1)=='undefined' || typeof(t2)=='undefined' || typeof(social)=='undefined'){
    res.send({result:"no", msg:'Bad request body while registering access'})
    return
  }

  // If there are not cookies
  var cookie = req.cookies.porkett
  if (typeof(cookie)=='undefined' || typeof(cookie.logged)=='undefined' ) {
    cookie = {}
    cookie.logged = []
  }
  
  // Add new social field to cookie
  switch (social) {
    case 'twt': {
        cookie.twt = {}
        cookie.twt.token1 = t1
        cookie.twt.token2 = t2
        cookie.logged.push('twt')
        res.cookie('porkett', cookie)
        break
    }
    default: res.send({result:"no", msg:'Register access to social '+social+' not implemented'}); return;
  }

  res.send({result:"yes", msg:'registered to '+social})
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
