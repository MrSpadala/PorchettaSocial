function validaPost(){
	if(!document.getElementById("twt").checked && !document.getElementById("tmb").checked && !document.getElementById("fkr").checked){
		alert("You must choose at least one social network!");
		return false;
	}
	if(document.getElementById("text").value==""){
		alert("You first should write something to post!");
		return false;
	}
	return true;
}


window.onload = function(){
	var list = document.getElementById("s_button");
	// click on button submit
	list.addEventListener('click' , function(){
		
		if(true){ // validaPost()==true
			var to_post = document.getElementById("text").value;
			var fileInput = document.getElementById('image_upload');
			
			if(fileInput.value==""){
				text = {
					data : to_post,
					twt : document.getElementById("twt").checked.toString(),
					tmb : document.getElementById("tmb").checked.toString(),
					flk : document.getElementById("fkr").checked.toString(),
					img : ""
				}
				console.log(text);
				post("post","http://localhost/home", text);
			}
			else {
				var file = fileInput.files[0];
				var reader = new FileReader();
				reader.onload = function(e) {
					text = {
						data : to_post,
						twt : document.getElementById("twt").checked.toString(),
						tmb : document.getElementById("tmb").checked.toString(),
						flk : document.getElementById("fkr").checked.toString(),
						img : reader.result.toString()
				    }
				    console.log(text);
				    post("post","http://localhost/home", text);
				}
			    reader.readAsBinaryString(file);
			}
		}
		
	});
}

function post(method, path, params) {
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
		var led_light = document.getElementById("twt_led");
		if(led_light.className == "led-red"){
			auth_twt(led_light);
		} else {
			alert("You are already logged on twitter!")
	    }
	} else {
		alert("WebSocket NOT supported by your Browser!");
	} 
}

function auth_twt(led_light){	
	var ws_twt = new WebSocket('ws://localhost:12345');
    
    ws_twt.onopen = function(){
      ws_twt.send("auth");
      led_light.setAttribute( "class", "led-green" );
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
		post("get","http://localhost/auth/start/twitter",data);
		window.open(url);
		
    };
    
    ws_twt.onclose = function(){
	  led_light.setAttribute( "class", "led-red" );
      alert("Connection closed");
    };
    
    ws_twt.onerror = function(){
	  led_light.setAttribute( "class", "led-red" );
      alert("Connection error");
    };
}





	// TUMBLR AUTH	
function log_on_tumblr(){
	if ("WebSocket" in window){
		var led_light = document.getElementById("tmb_led");
		if(led_light.className == "led-red"){
			auth_tmb(led_light);
		} else {
			alert("You are already logged on tumblr!")
	    }
	} else {
		alert("WebSocket NOT supported by your Browser!");
	} 
}

function auth_tmb(led_light){	
	var ws_tmb = new WebSocket('ws://localhost:12346');
    
    ws_tmb.onopen = function(){
      ws_tmb.send("auth");
      led_light.setAttribute( "class", "led-green" );
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
		post("get","http://localhost/auth/start/tumblr",data);
		window.open(url);
      
    };
    
    ws_tmb.onclose = function(){
		led_light.setAttribute( "class", "led-red" );
        alert("Connection closed");
    };
    
    ws_tmb.onerror = function(){
		led_light.setAttribute( "class", "led-red" );
        alert("Connection error");
    };
}





	// FLICKR AUTH
function log_on_flickr(){
	if ("WebSocket" in window){
		var led_light = document.getElementById("fkr_led");
		if(led_light.className == "led-red"){
			auth_fkr(led_light);
		} else {
			alert("You are already logged on Flickr!")
	    }
	} else {
		alert("WebSocket NOT supported by your Browser!");
	} 
}

function auth_fkr(led_light){	
	var ws_fkr = new WebSocket('ws://localhost:12347'); //to be defined
    
    ws_fkr.onopen = function(){
      ws_fkr.send("auth");
      led_light.setAttribute( "class", "led-green" );
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
		post("get","http://localhost/auth/start/flickr",data);
		window.open(url);
      
    };
    
    ws_fkr.onclose = function(){
		led_light.setAttribute( "class", "led-red" );
        alert("Connection closed");
    };
    
    ws_fkr.onerror = function(){
		led_light.setAttribute( "class", "led-red" );
        alert("Connection error");
    };
}
			
