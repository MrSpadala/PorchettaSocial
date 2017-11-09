
// si occupa di gestire le risposte delle RPC


// importo i moduli locali
var queue = require('./queues.js')
var globals = require('./globals.js')
var log = globals.log


// handle rpc return
function handler(msg) {
  params = msg.split('\xFF')

  log('RPC id:'+id+' Results: '+results)

  // TODO do something with the results

}



// export wait responses callback
module.exports = {
  handler
}
