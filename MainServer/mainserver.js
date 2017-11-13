
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
var app = require('express')()
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
  res.cookie('er_manz', '10')

  res.send('<html>SCEEMOOOO!<br>Fammi una POST</html>')
})


// testing
app.get('/cookie_test', function(req, res) {
  console.log("Cookies: ", req.cookies)
  res.send('ciao')
})



function auth(network) {
    // TODO OAuth logic here
}



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

  // sanity check, list and text can't be undefined
  if (typeof(text) == 'undefined' || typeof(list) == 'undefined') {
    res.status(400)   //bad request
    res.send("The received POST didn't have correct parameters in the body")
    return
  }

  text = text.trim()   //removing leading and trailing spaces

  // sanity check, filter all social not listed in RPC_FORMAT.md
  list = list.filter(function(e){ return e in ['fb','twt','g+','tmb'] })

  // sanity check, if list is empty i don't publish on any social network
  if (list.length == 0) {
    res.send('no social selected')
    return
  }
  


  token = null
  token_oauth1 = null
  
  // TODO select format for cookies
  cookie = req.cookies.porchetto_cookie
  list.forEach( function(network) {
    if (typeof(cookie)=='undefined' || !network in cookie.logged)
      auth(network)
  })
  

  // sanity check, if user post contains utf char '\xFF' 'ÿ', substitute the 'ÿ' with a 'y'
  text = text.replace(new RegExp('\xFF', 'g'), 'y')

    // TODO change send method, token and token_oauth1 must be lists
    // list = [fb, twt, tmb]  =>  token = [token fb, token twt, token tmb]

  // if the program is here we have a token, proceed to upload post
  // (Following RPC syntax in RPC_FORMAT.md)
  var msg = ['upload_post', text, token, token_oauth1].join('\xFF')
  queue.send(msg, list)

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
