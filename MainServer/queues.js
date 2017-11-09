// comunicazione con le code
var sleep = require('sleep')
var globals = require('./globals.js')
var amqp = require('amqplib/callback_api');
var rpc_handler = require('./rpc-handler.js').handler
var log = globals.log

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

  amqp.connect('amqp://rabbit-mq', function(err,conn) {
    conn.createChannel(function(err,ch) {
       
      var ex = 'exchange_name';

      var correlation_id_list = [];
    
      ch.assertExchange(ex,'direct', {durable: true});
      ch.assertQueue(to_server_queue, {durable: true});
	
	  for (var k = 0; k < network_list.length; k++){
		  var msg_id = globals.request_msg_id().toString()	//aggiunto il toString perchè lo vuole come stringa
		  var real_msg = [msg_id, msg].join('xFF');
		  ch.publish(ex, network_list[k] , new Buffer(real_msg));
		  correlation_id_list.push(msg_id);
		  log('Sent msg_id:'+ msg_id + ' ' + msg ); 
	  }

      // get the results of the rpcs launched
      correlation_id_list.forEach( function(id){
	      
	      var to_server_queue = 'to_server';
	      ch.assertQueue(to_server_queue, {durable:true});
	      
	      // reads message
	      log('Waiting for RPC id: '+id);
	      ch.consume(to_server_queue, function(msg) {
		      var splitted_msg = msg.split('xFF');
		      if (splitted_msg[0] == id) rpc_handler(msg)
	      }, {noAck:true});
      });      
      });
  });
}



 
// TODO forse si può unire la funzione recvFromQueues in fondo a sendToQueues per evitare di riconnettersi



/*function recvFromQueues(correlation_id) {

  amqp.connect('amqp://rabbit-mq', function(err, conn) {
	  conn.createChannel(function(err,ch) {
		  var to_server_queue = 'to_server';
		  ch.assertQueue(to_server_queue, {durable:true});
		  
		  // reads a message
		  log('Waiting for RPC id:'+correlation_id)
		  ch.consume(to_server_queue, function(msg){
			if (msg.properies.correlationId == correlation_id)
			  rpc_handler(msg)
		  }, {noAck: true});
	  });
  });
}
*/


// esporto le funzioni
module.exports = {
  send: sendToQueues,
 // recv: recvFromQueues
}


