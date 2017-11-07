// comunicazione con le code
var globals = require('./globals.js')
var amqp = require('amqplib/callback_api');

/* Inoltra il messaggio alle code, ritorna una lista formata dai correlation_id
 * (forniti da rabbit) dei messaggi inviati
 * 
 * msg è il messaggio da inoltrare
 * network_list è la lista dei social network selezionati, seguendo l'id_api dentro RPC_FORMAT.md,
 *              quindi twitter 'twt', googleplus 'g+', facebook 'fb'
 *
 *              esempio, se la lista è ['twt', 'fb'] pubblicare solo su twitter e facebook
 */
function sendToQueues(msg, network_list) {
  // TODO send to the right RabbitMQ queues DA SISTEMARE 

  amqp.connect(/*main server*/, function(err,conn) {
    conn.createChannel(function(err,ch) {
      var fb_queue = 'fb';
      var g_queue = 'g+';
      var twt_queue = 'twt';
	  var tumblr_queue = 'tmb'
    
      var to_server_queue = 'to_server';
    
      var ex = 'exchange_name';
    
      ch.assertExchange(ex,'direct', {durable: true});
      ch.assertQueue(to_server_queue, {durable: true});
      ch.assertQueue(fb_queue, {durable: true, reply_to: to_server_queue});
      ch.assertQueue(g_queue, {durable: true, reply_to: to_server_queue});
      ch.assertQueue(twt_queue, {durable: true, reply_to: to_server_queue});
   
      ch.bindQueue(fb_queue,ex,'fb');
      // l'ultimo parametro è la routing_key, in questo modo una post con routing key = 'fb' va sullacoda fb_queue
      ch.bindQueue(g_queue,ex,'g+');
      ch.bindQueue(twt_queue,ex,'twt');

      //se facciamo una cosa carina, che tipo i nomi dei social in network_list è uguale alla routing_key del social
      //possiamo prendere direttamente i valori da li e usarli nella publish 
      ch.publish(ex, network_list, new Buffer(msg));
    });
  });

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


