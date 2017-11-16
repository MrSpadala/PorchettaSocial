import oauth2 as oauth
import time
import httplib2
import urllib

import asyncio
import websockets

ip_address = 'localhost'
port = 3000

token_request_url = "https://www.flickr.com/services/oauth/request_token"
authorize_url = "https://www.flickr.com/services/oauth/authorize"
access_token_url = "https://www.flickr.com/services/oauth/access_token"

apikey = '5b5735907b2fc27180f61c658624f3c6'
apisecret = '1c8a1fe350a2c875'

def get_request_token():
	
	params = {
	'oauth_timestamp': str(int(time.time())),
	'oauth_signature_method':"HMAC-SHA1",
	'oauth_version': "1.0",
	'oauth_callback': callback,
	'oauth_nonce': oauth.generate_nonce(),
	'oauth_consumer_key': apikey
	}

	consumer = oauth.Consumer(key=apikey, secret=apisecret)
	req = oauth.Request(method="GET", url=token_request_url, parameters=params)
	req['oauth_signature'] = oauth.SignatureMethod_HMAC_SHA1().sign(req,consumer,None)
	h = httplib2.Http(".cache")
	resp, content = h.request(req.to_url(), "GET")

	#parse the content
	content = content.decode('utf-8')
	request_token = dict(urllib.parse.parse_qsl(content))
	
	
	return request_token['oauth_token'], request_token['oauth_token_secret']
	
	
def get_access_token(pin, request_token, request_token_secret):
	
	access_token_parms = {
	'oauth_consumer_key': apikey,
	'oauth_nonce': oauth.generate_nonce(),
	'oauth_signature_method':"HMAC-SHA1",
	'oauth_timestamp': str(int(time.time())),
	'oauth_token':	request_token,
	'oauth_verifier' : pin
	}

	#setup request
	req = oauth.Request(method="GET", url=access_token_url, parameters=access_token_parms)
	req['oauth_signature'] = oauth.SignatureMethod_HMAC_SHA1().sign(req,consumer,token)

	#make the request
	h = httplib2.Http(".cache")
	resp, content = h.request(req.to_url(), "GET")

	#parse the response
	content = content.decode('utf-8')
	access_token_resp = dict(urllib.parse.parse_qsl(content))
	
	return access_token_resp['oauth_token'], access_token_resp['oauth_token_secret']
	

async def callback(websocket, path):
	
	stringa = await websocket.recv()
	print(stringa)
	
	l = stringa.split('ÿ')
	print("Received msg splitted ",l)

	flag = 'ÿ'
	name = 'fkr'
	
	if (l[0] == 'auth'):
		request_token, request_token_secret = get_request_token()
		
		stringa_invio =name+flag+'auth'+flag+authorize_url+flag+request_token+flag+request_token_secret
		await websocket.send(stringa_invio)
	
	elif l[0] == 'verify_pin':

		pin = l[1]                
		request_token = l[2]
		request_token_secret = l[3]
		stringa_invio = ''
		
		try:
			access_token, access_token_secret = get_access_token(pin, request_token, request_token_secret)
			stringa_invio = name+flag+'verify_pin'+flag+access_token+flag+access_token_secret

		except Exception:
			stringa_invio =name+flag+'verify_pin'+flag+'exception_occurred'

		await websocket.send(stringa_invio)

###	
start_server = websockets.serve(callback, ip_address, port)
print('Listening on port: ', port)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
