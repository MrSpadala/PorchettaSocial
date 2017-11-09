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
  // TODO send to the right RabbitMQ queues 

  amqp.connect(/*main server*/, function(err,conn) {
    conn.createChannel(function(err,ch) {
    
      var to_server_queue = 'to_server';
    
      var ex = 'exchange_name';
    
      ch.assertExchange(ex,'direct', {durable: true});
      ch.assertQueue(to_server_queue, {durable: true});
	
	var correlation_id_list = new Array;
	    
	for (var k = 0; k < network_list.length; k++){
	      var msg_id = globals.request_msg_id()
	      ch.publish(ex, network_list[k] , new Buffer(msg), {correlationId: msg_id, replyTo: to_server_queue});
	      correlation_id_list.push(msg_id);
	      log('Sent msg_id:'+ msg_id + msg ); 
	}
	
    });
  });

  return correlation_id_list 

}



function recvFromQueues(correlation_id) {
  var results = []  // i risultati possono essere più di uno

  // TODO receive from queue
  amqp.connect( /* main server */, function(err, conn) {
	  conn.createChannel(function(err,ch) {
		  var to_server_queue = 'to_server';
		  ch.assertQueue(to_server_queue, {durable:true});
		  
		  ch.consume(to_server_queue, function(msg) {
			   var msg_splitted = msg.split('\xFF');
			  // processamento del messaggio secondo il formato id_api | comando | res_1 | res_2 | ...
			  // result.push(risultati)		  
		  }, {noAck: true});
	  });
  });

  return results
}



// esporto le funzioni
module.exports = {
  send: sendToQueues,
  recv: recvFromQueues
}


