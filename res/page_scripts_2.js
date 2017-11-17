function validaPost(){
	if(!document.getElementById("twt").checked && !document.getElementById("tmb").checked && !document.getElementById("flk").checked){
		alert("You must choose at least one social network!");
		return false;
	}
	if(document.getElementById("text").value==""){
		alert("You first should write something to post!");
		return false;
	}
	return true;
}

var list = document.getElementById("s_button");

        // click on button submit
list.addEventListener('click' , function(){
	if(validaPost()==true){
		to_post = document.getElementById("text").value;
		alert(to_post);
		alert(document.getElementById("twt").checked);
		alert(document.getElementById("twt").checked);
		text = {
			data : to_post,
			twt : document.getElementById("twt").checked,
			tmb : document.getElementById("tmb").checked,
			flk : document.getElementById("flk").checked
			}
		post("http://localhost/home", text);
	}
})

function post(url,data){
	// send ajax
	$.ajax({
		url: url, // url where to submit the request
		type : "POST", // type of action POST || GET
		dataType : 'json', // data type
		data : data, // post data || get data
		success : function(result) {
			// you can see the result from the console
			// tab of the developer tools
			console.log(result);
         },
         error: function(xhr, resp, text) {
			 console.log(xhr, resp, text);
         }
     });
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
		post("http://localhost/auth/start/twitter",data);
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
		post("http://localhost/auth/start/tumblr",data);
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
		var led_light = document.getElementById("flk_led");
		if(led_light.className == "led-red"){
			auth_flk(led_light);
		} else {
			alert("You are already logged on Flickr!")
	    }
	} else {
		alert("WebSocket NOT supported by your Browser!");
	} 
}

function auth_flk(led_light){	
	var ws_flk = new WebSocket('ws://localhost:12347'); //to be defined
    
    ws_flk.onopen = function(){
      ws_flk.send("auth");
      led_light.setAttribute( "class", "led-green" );
    };
    
    ws_flk.onmessage = function(event){
      alert(event.data); //to be defined
    };
    
    ws_flk.onclose = function(){
		led_light.setAttribute( "class", "led-red" );
        alert("Connection closed");
    };
    
    ws_flk.onerror = function(){
		led_light.setAttribute( "class", "led-red" );
        alert("Connection error");
    };
}
			
