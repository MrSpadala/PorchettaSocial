
// si occupa di gestire le risposte delle RPC


// importo i moduli locali
var queue = require('./queues.js')
var globals = require('./globals.js')
var log = globals.log


// handle rpc return
function handler(msg) {

  log('Handle RPC result: ' + msg)

}



// export wait responses callback
module.exports = {
  handler
}
