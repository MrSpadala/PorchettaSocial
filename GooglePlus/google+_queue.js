/ access.domainRestricted deve essere TRUE per pubblicare post con le API
// i post sono privati di default, per cambiare la proprietà modificare acess.items 

var amqp = require('amqplib/callback_api');

function readPostAndReply(){

    amqp.connect('amqp://rabbit-mq' ,function(err,conn){

        conn.createChannel(function(err,ch){
            
            var g_queue = 'g+';
            var to_server_queue = 'to_server';
            
            ch.assertQueue(to_server_queue, {durable:true});
            ch.assertQueue(g_queue, {durable:true});
            
            ch.consume(g_queue, function(msg) {
            
                var splitted_msg = msg.split('xFF');
                
                // prendo il msg_id da inserire nel messaggio di ritorno
                var msg_id = splitted_msg[0];  
                
                // prendo il testo del post e l'access token
                var text = splitted_msg[1];
                var access_token = splitted_msg[2];
                
                // prendo userId da splitted_smg o dai cookie o da non si sa cosa
                
                   /*                          
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
                } */
                
                var json_object = '({ "object" : {' +
                    +' "originalContent": '+text+',' +
                    +'},' +
                    +'"access": {' +
                    +'"items" : [{ ' +
                    +'"type" : "domain" '+
                    +' }],'+
                    +'"domainRestricted" : true '+
                    +' } '+
                    +' })'
                
                var real_msg = JSON.stringify(eval(json_object));
                                               
                /*                                                
                POST https://www.googleapis.com/plusDomains/v1/people/{userId}/activities  con il real_msg e i token vari*/
                           
                var response = /* ricezione della risposta http */
                var response_to_server = [api_id, msg_id, response].join('xFF');                       
                /* formatto la risposta inserendo api_id e msg_id (il primo fisso di google plus, secondo da splitted_msg*/ 
                                         
                ch.sendToQueue(to_server_queue,new Buffer(response_to_server));
                  }
              }, {noAck : true});
          });
      });
}

module.exports = {
consume : readPostAndReply;
}
