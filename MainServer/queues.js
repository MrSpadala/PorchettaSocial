
// riceve dal mainserver.js il testo dell'utente e l'access token.
// Si occupa di mettere i dati nella forma giusta e di mandarli
// nella coda corretta


var globals = require('./globals.js')


function sendToQueues(msg, token) {
  var data = stringfy(msg, token)
  if (globals.debug)
	console.log('[DEBUG] '+new Date+' mainserver sent to queues: '+data)

  // TODO send to appropriate RabbitMQ queue
}




/** ritorna una stringa fatta in questo modo
 *
 *  |flag | access  token | flag | text | flag|
 * 
 *  flag è un byte che delimita i campi
 *  text è il testo inserito dall'utente
 *  access token è rappresentato come una stringa
 */
function stringfy(msg, token) {
  var flag = '\xFF'
  
  // se l'utente inserisce in qualche modo il byte della flag nel
  // messaggio succede un mecellone. In questo caso che la flag
  // vale 0xFF corrispondente a 'ÿ' , sostituisco 'ÿ' con 'y' nel messaggio
  msg = msg.replace(new RegExp(flag, 'g'), 'y')

  return flag + token + flag + msg + flag
}



// esporto la funzione di send
module.exports = {
  send: sendToQueues
}
