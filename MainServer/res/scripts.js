function validaPost(){
	if(!document.getElementById("twt").checked && !document.getElementById("tmb").checked && !document.getElementById("fkr").checked){
		alert("You must choose at least one social network!");
		return false;
	}
	return true;
}


function checkCookie(social_flag){
	var cookie = document.cookie;
	if(cookie==""){
		//alert("No cookies");
		return false;
	}
	if(cookie.search(social_flag) != -1){
		return true;
	}
	return false;
}

function toServer(method, path, params) {
	//method = method | "get"; // Set method to post by default if not specified.

	// The rest of this code assumes you are not using a library.
	// It can be made less wordy if you use one.
	var form = document.createElement("form");
	form.setAttribute("method", method);
	form.setAttribute("action", path);
	form.setAttribute("target", "_blank");        

	for(var key in params) {
		if(params.hasOwnProperty(key)) {
			var hiddenField = document.createElement("input");
			hiddenField.setAttribute("type", "hidden");
			hiddenField.setAttribute("name", key);
			hiddenField.setAttribute("value", params[key]);

			form.appendChild(hiddenField);
		}
	}

	document.body.appendChild(form);
	form.submit();
}



	
	// TWITTER AUTH		
function log_on_twitter(){
	if ("WebSocket" in window){
		var isLogged = checkCookie("twt");
		//alert(isLogged);
		if(isLogged == true){
			alert("You are already logged on twitter");
		}
		else {
			auth_twt();
		}
	} else {
		alert("WebSocket NOT supported by your Browser!");
	} 
}

function auth_twt(){	
	var ws_twt = new WebSocket('ws://localhost:12345');
    
    ws_twt.onopen = function(){
      ws_twt.send("auth");
    };
    
    ws_twt.onmessage = function(event){
		data= event.data.split("\xFF");
		// twt|auth|url|token1|token2
		url = data[2];
		token1 = data[3];
		token2 = data[4];
		data = {
			"token1" : token1,
			"token2" : token2
		}
		toServer("get","http://localhost/auth/start/twitter",data);
		window.open(url);
		
    };
    
    ws_twt.onclose = function(){
    };
    
    ws_twt.onerror = function(){
      alert("Connection error");
    };
}



	// TUMBLR AUTH	
function log_on_tumblr(){
	if ("WebSocket" in window){
		var isLogged = checkCookie("tmb");
		//alert(isLogged);
		if(isLogged == true){
			alert("You are already logged on tumblr");
		}
		else {
			auth_tmb();
		}
	} else {
		alert("WebSocket NOT supported by your Browser!");
	} 
}

function auth_tmb(){	
	var ws_tmb = new WebSocket('ws://localhost:12346');
    
    ws_tmb.onopen = function(){
      ws_tmb.send("auth");
    };
    
    ws_tmb.onmessage = function(event){
      data= event.data.split("\xFF");
		// tmb|auth|url|token1|token2
		url = data[2];
		token1 = data[3];
		token2 = data[4];
		data = {
			"token1" : token1,
			"token2" : token2
		}
		toServer("get","http://localhost/auth/start/tumblr",data);
		window.open(url);
      
    };
    
    ws_tmb.onclose = function(){
    };
    
    ws_tmb.onerror = function(){
        alert("Connection error");
    };
}



	// FLICKR AUTH
function log_on_flickr(){
	if ("WebSocket" in window){
		var isLogged = checkCookie("fkr");
		//alert(isLogged);
		if(isLogged == true){
			alert("You are already logged on flickr");
		}
		else {
			auth_fkr();
		}
	} else {
		alert("WebSocket NOT supported by your Browser!");
	} 
}

function auth_fkr(){	
	var ws_fkr = new WebSocket('ws://localhost:12347'); //to be defined
    
    ws_fkr.onopen = function(){
      ws_fkr.send("auth");
    };
    
    ws_fkr.onmessage = function(event){
      data= event.data.split("\xFF");
		// fkr|auth|url|token1|token2
		url = data[2];
		token1 = data[3];
		token2 = data[4];
		data = {
			"token1" : token1,
			"token2" : token2
		}
		toServer("get","http://localhost/auth/start/flickr",data);
		window.open(url);
      
    };
    
    ws_fkr.onclose = function(){
    };
    
    ws_fkr.onerror = function(){
        alert("Connection error");
    };
}

function log_out(){
	var cookies = document.cookie;
	if(cookies==""){
		alert("You are not logged on any social");
	}
	else {
		$.ajax({
			type: "DELETE",
			url: "http://localhost/auth/access",
			success: function(msg){
				alert("Logout successful!");
			}
		});
	}
}
			
