
// contiene variabili e funzioni globali del mainserver


// per stampare informazioni di debug
const debug = true

// in ascolto di connessioni sulla porta
const port = 8080


// for debugging pursposes, i have an unique id of every user request, like a client id
var req_id = 0

function increase_req_id() {
  req_id++
}


// logging
const log_on_stdout = true
const log_on_file   = false
var fs = require('fs')  // filesystem library

function log(msg) {
  var entry = '[MainServer] '+new Date+' req_id='+req_id+' | '+msg
  if (log_on_stdout)
	console.log(entry)
  if (log_on_file)
	fs.appendFile('mainserver.log', entry+'\n', (err) => {if (err) console.log('Error writing on logfile')})
}



// esporto
module.exports = {
  debug,
  port,
  increase_req_id,
  log
}
