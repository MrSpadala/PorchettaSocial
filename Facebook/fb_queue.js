var amqp = require('amqplib/callback_api');

function readPostAndReply() {
amqp.connect('amqp://rabbit-mq', function(err, conn) {
	     conn.createChannel(function(err,ch) {
            var fb_queue = ‘fb’;

            var to_server_queue = 'to_server';
            
            ch.assertQueue(to_server_queue, {durable:true});
            ch.assertQueue(fb_queue, {durable:true});
            
            ch.consume(fb_queue, function(msg) {
            
              var splitted_msg = msg.split('xFF');
              
              var msg_id = splitted_msg[0];
              var text = splitted_msg[1]; //da RPC_FORMAT il primo parametro è il testo
              var access_token = splitted_msg[2];
              
              to_post = "/"+/*user_id*/+"feed?message="+str(text)+"&access_token="+access_token
              // va aggiunto l'appoggio a OauthService con key e cose varie 

              //la risposta generata in formato 201:Created o Error Code viene formattata
              var message_to_server = [api_id, msg_id, response].join('xFF');

		          ch.sendToQueue(to_server_queue, new Buffer(message_to_server));

	    }, {noAck: true});

	});

    });

}



module.exports = { 

consume : readPostAndReply

}
