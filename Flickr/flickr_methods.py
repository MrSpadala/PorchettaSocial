import oauth2 as oauth
import time
import httplib2
import urllib
import requests

token_request_url = "https://www.flickr.com/services/oauth/request_token"
authorize_url = "https://www.flickr.com/services/oauth/authorize"
access_token_url = "https://www.flickr.com/services/oauth/access_token"
photo_url = 'https://api.flickr.com/services/upload'

apikey = '5b5735907b2fc27180f61c658624f3c6'
apisecret = '1c8a1fe350a2c875'
callback = 'http://localhost/auth/landing/flickr'

consumer = oauth.Consumer(key=apikey, secret=apisecret)

def get_request_token():
	
	params = {
	'oauth_timestamp': str(int(time.time())),
	'oauth_signature_method':"HMAC-SHA1",
	'oauth_version': "1.0",
	'oauth_callback': callback,
	'oauth_nonce': oauth.generate_nonce(),
	'oauth_consumer_key': apikey
	}

	req = oauth.Request(method="GET", url=token_request_url, parameters=params)
	req['oauth_signature'] = oauth.SignatureMethod_HMAC_SHA1().sign(req,consumer,None)
	h = httplib2.Http(".cache")
	resp, content = h.request(req.to_url(), "GET")

	#parse the content
	content = content.decode('utf-8')
	request_token = dict(urllib.parse.parse_qsl(content))
	
	
	return request_token['oauth_token'], request_token['oauth_token_secret']
	
def get_access_token(pin, request_token, request_token_secret):
	
	token = oauth.Token(request_token, request_token_secret)
	token.set_verifier(pin)
	
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

	
def upload_photo(photo_bin, photo_title, request_token, request_token_secret):

	token = oauth.Token(request_token, request_token_secret)
	
	data = {
		'oauth_consumer_key': consumer.key,
		'oauth_nonce': oauth.generate_nonce(),
		'oauth_signature_method':"HMAC-SHA1",
		'oauth_timestamp': str(int(time.time())),
		'oauth_token': token.key,
		'oauth_version': 1.0,
	}
	
	req = oauth.Request(method="POST", url=photo_url, parameters=data)
	req['oauth_signature'] = oauth.SignatureMethod_HMAC_SHA1().sign(req, consumer, token)

	
	files = {'photo': (photo_title, photo_bin)}
	r = requests.post(photo_url, data=req, files=files)
	print(r)
	return r.status_code

def get_url(token1):
	return "%s?oauth_token=%s&perms=write" % (authorize_url, token1)
