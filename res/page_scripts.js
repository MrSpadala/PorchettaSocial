
function valida_post(){
	if(!document.getElementById("twt").checked && !document.getElementById("tmb").checked && !document.getElementById("flk").checked){
		alert("You must choose at least one social network!");
		return false;
	}
	if(document.getElementById("text").value==""){
		alert("You first should write something to post!");
		return false;
	}
	if(document.getElementById("twt").checked && document.getElementById("twt_led").className == "led-red"){
		alert("You cannot post on social networks you are not connected to! Please click on the images to connect.");
		return false;
	}
	if(document.getElementById("tmb").checked && document.getElementById("tmb_led").className == "led-red"){
		alert("You cannot post on social networks you are not connected to! Please click on the images to connect.");
		return false;
	}
	if(document.getElementById("flk").checked && document.getElementById("flk_led").className == "led-red"){
		alert("You cannot post on social networks you are not connected to! Please click on the images to connect.");
		return false;
	}
	return true;
}


	
	// TWITTER AUTH		
function log_on_twitter(){
	if ("WebSocket" in window){
		var led_light = document.getElementById("twt_led");
		if(led_light.className == "led-red"){
			auth_twt(led_light);
			//led_light.setAttribute( "class", "led-green" );
		} else {
			alert("You are already logged on twitter!")
			//led_light.setAttribute( "class", "led-red" );
	    }
	} else {
		alert("WebSocket NOT supported by your Browser!");
	} 
}

function auth_twt(led_light){	
	var ws_twt = new WebSocket('ws://echo.websocket.org'); //to be defined
    
    ws_twt.onopen = function(){
      ws_twt.send("auth");
      led_light.setAttribute( "class", "led-green" );
    };
    
    ws_twt.onmessage = function(event){
      alert(event.data); //to be defined
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
			auth_twt(led_light);
			//led_light.setAttribute( "class", "led-green" );
		} else {
			alert("You are already logged on tumblr!")
			//led_light.setAttribute( "class", "led-red" );
	    }
	} else {
		alert("WebSocket NOT supported by your Browser!");
	} 
}

function auth_tmb(led_light){	
	var ws_tmb = new WebSocket('ws://echo.websocket.org'); //to be defined
    
    ws_tmb.onopen = function(){
      ws_tmb.send("auth");
      led_light.setAttribute( "class", "led-green" );
    };
    
    ws_tmb.onmessage = function(event){
      alert(event.data); //to be defined
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
	var led_light = document.getElementById("flk_led");
		if(led_light.className == "led-red"){
			led_light.setAttribute( "class", "led-green" );
		}
		else {
			led_light.setAttribute( "class", "led-red" );
		}
}
			
