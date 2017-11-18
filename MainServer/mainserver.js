
// per ora senza autenticazione, un client si connette al sito, scrive 
// il post che vuole fare e lo manda al server attraverso una POST


// importo i moduli locali
var auth = require('./auth.js')
//var queue = require('./queues.js')
var post = require('./upload_post.js')
var globals = require('./globals.js')
var req_list = globals.req_list
var log = globals.log


// load and configuring libraries
// bodyParser mi serve per parsare la POST
var bodyParser = require('body-parser')
var c00kies = require('cookie-parser')
var express = require('express')
//var fs = require('fs')
var app = express()
var server = null
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(c00kies())



// pages for debugging
app.get('/debug/cookies', function(req, res) {
  res.send(req.cookies)
})

app.get('/debug/req_list', function(req, res) {
  res.send(req_list)
})




// testing, attualmente pagina funzionante per loggare e postare
// su twitter e facebook
app.get('/test_ws', function(req, res) {
  res.sendFile(__dirname + '/test.html')
})




// Home page
app.get('/', function(req, res) {
  res.redirect('/home')
})

app.get('/home', function(req, res) {
  res.sendFile(__dirname + '/res/porchetta_website.html')
})

// Resources
app.get('/res/:resource', function(req, res) {
  res.sendFile(__dirname + '/res/'+req.params.resource)
})



/* User POSTs when he wants to upload a post
 *
 * The body of the POST made by the user it's made:
 * {
 *   'data' = text of the post 
 *   'twt'  = true / false
 *   'tmb'  = true / false
 *   'fkr'  = true / false
 *   'image' = binary content
 * }
 * 
 * where twt is true if the user wants to post to twitter, tmb if he wants
 * to post to tumbrl and flk for flickr
 * 
 * 'image' is optional, is the content of the image. If there's no image then
  * it's an empty string ""
 */
app.post('/home', function (req, res) {  
  post.upload_post(req, res)
})




/* tokens that will be used to verify pin are saved in req_list. token1 and token2 are URLencoded
 */
app.get('/auth/start/twitter', function(req, res) {
  auth.start('twt', req, res)
})

app.get('/auth/start/tumblr', function(req, res)  {
  auth.start('tmb', req, res)
})

app.get('/auth/start/flickr', function(req, res)  {
  auth.start('fkr', req, res)
})




/* OAuth redirect page
 */
app.get('/auth/landing/twitter', function(req, res) {
  auth.oauth_landing('twt', 'twitter', req, res)
})

app.get('/auth/landing/tumblr', function(req, res)  {
  auth.oauth_landing('tmb', 'tumblr', req, res)
})

app.get('/auth/landing/flickr', function(req, res)  {
  auth.oauth_landing('fkr', 'flickr', req, res)
})
 
 
 
 
/* After a successful auth the server register access tokens in cookies. 
 *   request body:
 *   {
 *      token1: 'token1',
 *      token2: 'token2'
 *   }
 *
 *   Cookie set:
 *   {
 *      social: 'nome-social'   #id del social dove ci si è autenticati
 *      token1: 'token1'   
 *      token2: 'token2'
 *   }
*/
app.post('/register_access/twitter', function(req, res) {
  auth.register_access('twt', req, res)
})

app.post('/register_access/tumblr', function(req, res)  {
  auth.register_access('tmb', req, res)
})

app.post('/register_access/flickr', function(req, res)  {
  auth.register_access('fkr', req, res)
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
