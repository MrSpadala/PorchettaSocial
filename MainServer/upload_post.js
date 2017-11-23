// si occupa di caricare il post facendo i controlli necessari e inoltrando alle code

var queue = require('./queues.js')
var globals = require('./globals.js')
var log = globals.log


function upload_post(req, res) {
  var text = req.body.data
 
  // Build list from single fields
  var list = []
  if (req.body.twt == 'true') list.push('twt')
  if (req.body.tmb == 'true') list.push('tmb')
  if (req.body.fkr == 'true') list.push('fkr')
  
  var image = req.body.image
  if (typeof(image)=='undefined')
    image = ""
  console.log('IMAGE IS: '+image.slice(100))
  
  log('Received text:'+text+' list:'+list)

  // sanity check, list and text can't be undefined
  if (typeof(text) == 'undefined' || typeof(list) == 'undefined') {
    res.status(400)   //bad request
    res.send({result:'no', msg:"The received POST didn't have correct parameters in the body"})
    return
  }

  text = text.trim()   //removing leading and trailing spaces
  
  // sanity check, filter all social not listed in RPC_FORMAT.md
  //list = list.filter(function(e){ return !e in ['fb','twt','g+','tmb'] })

  // sanity check, if list is empty i don't publish on any social network
  if (list.length == 0) {
    res.send({result:'no', msg:'no social selected'})
    return
  }

  // sanity check, if user post contains utf char '\xFF' 'ÿ', substitute the 'ÿ' with a 'y'
  text = text.replace(new RegExp('\xFF', 'g'), 'y')
 
  
  // C00kies sanity checks
  cookie = req.cookies.porkett
  var need_auth = []
  list.forEach( function(network) {
    if (typeof(cookie)=='undefined' || typeof(cookie.logged)=='undefined' ||
            !cookie.logged.includes(network))
      need_auth.push(network)
  })
  
  // If cookie fails sanity check
  if (need_auth.length > 0) {
    res.send({result:"no", msg:"Need auth to "+need_auth, auth:need_auth})
    return
  }


  var token1 = []
  var token2 = []
  var exception = false
  list.forEach( function(network) {
    try {
      token1.push(cookie[network].token1)
      token2.push(cookie[network].token2)
    } catch (ex) {
      exception = true
      res.send({result:"no", msg:"Need auth", auth:[network]})
      return
    }
  })
  
  if (exception)
    return

  // if the program is here we have a token, proceed to upload post
  // (Following RPC syntax in RPC_FORMAT.md)
  for (var i=0; i<list.length; i++) {
    var msg = ['upload_post', token1[i], token2[i], text, image].join('\xFF')
	queue.send(msg, list[i])
  }

  res.send({result:"yes", msg:"forwarded to "+list})
}

module.exports = {
  upload_post
}




