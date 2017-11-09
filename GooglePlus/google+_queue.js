// access.domainRestricted deve essere TRUE per pubblicare post con le API
// i post sono privati di default, per cambiare la proprietà modificare acess.items 

var amqp = require('amqplib/callback_api');

function readPostAndReply(){

    amqp.connect(/* main server*/, function(err,conn){

        conn.createChannel(function(err,ch){
            
            var g+_queue = 'g+';
            var to_server_queue = 'to_server';
            
            ch.assertQueue(to_server_queue, {durable:true});
            ch.assertQueue(g+_queue, {durable:true});
            
            ch.consume(g+_queue, function(msg) {
            
                var splitted_msg = msg.split('xFF');
                
                switch (splitted_msg[0]) {
                    case "auth": // redirect to authentication function of google plus
                                 break;
                                 
                    case "upload_post": /* text is the splitted_msg[1]
                                         token acess is the splitted_msg[2]
                                        
                                         if needed a cycle on splitted_msg.length for optional params
                                        
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
                                        
                                         /* prova di invio non automatico (senza reply to!) di risposta al server */
                                         var response = /* ricezione della risposta http */
                                         
                                         /* formatto la risposta inserendo api_id e msg_id */ 
                                         
                                         ch.sendToQueue(to_server_queue,new Buffer(response));
                  }
              }, {noAck : true});
          });
      });
}

module.exports = {
consume : readPostAndReply;
}
