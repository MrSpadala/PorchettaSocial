//Load express e body-parser
var bodyParser = require('body-parser')
var app = require('express')()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

console.log('Echo server started')

//Define request response in root URL (/)
app.post('/', function (req, res) {
  console.log('ricevuta post: '+req.body.data.toString())
  res.send(req.body.data.toString())
})


//Launch listening server on port 80
app.listen(80, function () {
  console.log('app listening on port 80!')
})

