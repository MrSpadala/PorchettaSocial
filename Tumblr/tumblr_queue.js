var amqp = require('amqplib/callback_api');

function readPostAndReply() {
amqp.connect('amqp://rabbit-mq', function(err, conn) {
				conn.createChannel(function(err,ch) {
						
            var tumblr_queue = ‘tmb’;
            var to_server_queue = 'to_server';

            ch.assertQueue(to_server_queue, {durable:true});
	    ch.assertQueue(tumblr_queue, {durable:true});
						
	    ch.consume(tumblr_queue, function(msg){
                var splitted_msg = msg.split('xFF');
                
                switch (splitted_msg[0]) { 
                  case "auth": //it means the comand is the authentication of this social
                               //redirect to tumblr.py for the authentication
                               break;
                               
                  case "upload_post":  var text = splitted_msg[1]; //da RPC_FORMAT il primo parametro è il testo
                                       var access_token = splitted_msg[2];
                                       var access_token2 = splitted_msg[3]; //secondo access token, tumblr usa oAuth1
                                       
                                       // bisognerebbe fare un ciclo fino a splitted_msg.length e prendere tutti i parametri
					// uno dei parametri deve essere il msg_id
                                       // con uno switch che ti identifica ogni parametro cosa è visto che sono opzionali
                                       // in questo modo ho acess token, testo, parametri
                                       
                                       tumblr_post_method = "https://api.tumblr.com/v2/blog/"+blog_id+"/post";
                                       // va aggiunta ?api_key=chiave&text=testo e tutto il resto
                                       
                                       //la risposta generata in formato 201:Created o Error Code viene formattata inserendo il msg_id
					ch.sendToQueue(to_server_queue,/* response*/);
                   }
                                       

		            }, {noAck: true});

						
				});
		});
}

module.exports = { 
consume : readPostAndReply
}
