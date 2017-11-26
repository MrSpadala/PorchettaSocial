
function cookies_check(){
	var i = "hello";
	postMessage(i);
	setTimeout("cookies_check()" , 2000);
}
cookies_check();
