// dovrebbe essere uguale a request
var requests = require('request-promise');

var SERVER = 'my-srvr'


// legge da stdin e invia al server
var stdin = process.openStdin()

console.log('Echo client started')

stdin.addListener('data', function(input) {
  var options = {
	method: 'POST',
	uri: 'http://'+SERVER,
	body: {
	  data: input.toString().trim()
	},
	json: true
  }

  requests(options, function (error, response, body) {
	console.log('response: '+body)
  })
})
