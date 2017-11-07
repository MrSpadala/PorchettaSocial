var express = require('express')
var request = require('request')

var client_id = '191401267480-kg43gjuls6in3lrj7o75b9r9ue6qjlie.apps.googleusercontent.com'
var client_secret = 'q_-hCPYtHGklXJerJ0UumKMP'
var scope1 = 'https://www.googleapis.com/auth/plus.stream.write'
var scope2 = 'https://www.googleapis.com/auth/plus.me'
var redirect_uri = 'http://localhost:3000/oauth2callback'

var oauth = 'https://accounts.google.com/o/oauth2/v2/auth?scope='+scope1+'+'+scope2+'&redirect_uri='+redirect_uri+'&response_type=code&client_id='+client_id+'&prompt=consent&include_granted_scopes=true'
var operazione = 'https://www.googleapis.com/plus/v1/people/me/activities/public'

var app = express()

//da qui riendirizzo verso la pagina di login
app.get('/', function(req, res) {
	res.redirect(oauth)	
})

//qui gestisco il callback
app.get('/oauth2callback', function(req, res) {
	
	var access_token
	
	var options = {
		code: req.query.code,
		client_id: client_id,
		client_secret: client_secret,
		redirect_uri: redirect_uri,
		grant_type: 'authorization_code'
    }
    
    request.post({url:'https://www.googleapis.com/oauth2/v4/token', form: options}, function optionalCallback(err, httpResponse, body) {
		var info = JSON.parse(body);
		access_token = info.access_token
		res.send("Login riuscito")

	})
	
	/*** TODO ***/
})



//qui creo un semplice server di prova --localhost:port
var port = 3000 
app.listen(port)
console.log('Server in ascolto sulla porta '+port)
