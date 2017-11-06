
// comunicazione con le code


var globals = require('./globals.js')



/* Inoltra il messaggio alle code, ritorna il correlation_id fornito da rabbit
 * 
 * msg è il messaggio da inoltrare
 * network_list è la lista dei social network selezionati, seguendo l'id_api dentro RPC_FORMAT.md,
 *              quindi twitter 'twt', googleplus 'g+', facebook 'fb'
 *
 *              esempio, se la lista è ['twt', 'fb'] pubblicare solo su twitter e facebook
 */
function sendToQueues(msg, network_list) {
  

  // TODO send to the right RabbitMQ queues


  // Questo pezzo di codice se me lo puoi appiccicare dove effettivamente inoltri i messaggi in coda
  //
  //  if (globals.debug)
  //	log('Sent ' /* + msg */)
  //


  return null 

}



function recvFromQueues(correlation_id) {
  var results = []  // i risultati possono essere più di uno

  // TODO receive from queue

  return results
}



// esporto le funzioni
module.exports = {
  send: sendToQueues,
  recv: recvFromQueues
}


