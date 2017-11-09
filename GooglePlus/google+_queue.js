// access.domainRestricted deve essere TRUE per pubblicare post con le API
// i post sono privati di default, per cambiare la proprietà modificare acess.items 

var amqp = require('amqplib/callback_api');

function readPostAndReply(){

    amqp.connect('amqp://rabbit-mq' ,function(err,conn){

        conn.createChannel(function(err,ch){
            
            var g+_queue = 'g+';
            var to_server_queue = 'to_server';
            
            ch.assertQueue(to_server_queue, {durable:true});
            ch.assertQueue(g+_queue, {durable:true});
            
            ch.consume(g+_queue, function(msg) {
            
                var splitted_msg = msg.split('xFF');
                
                /* define text, token access and params from splitted_msg[i]
                                        
                creation of the json body for the post:
                { "object" : {
                       "originalContent": text,
                              },
                 "access": {
                        "items": [{
                               "type" : "domain"
                                 }],
                        "domainRestricted" : true
                            }
                }
                                          
                POST https://www.googleapis.com/plusDomains/v1/people/{userId}/activities */
                           
                var response = /* ricezione della risposta http */
                                        
                /* formatto la risposta inserendo api_id e msg_id (il primo fisso di google plus, secondo da splitted_msg*/ 
                                         
                ch.sendToQueue(to_server_queue,new Buffer(response));
                  }
              }, {noAck : true});
          });
      });
}

module.exports = {
consume : readPostAndReply;
}
