import oauth2 as oauth
import webbrowser
import time
import httplib2
import urllib
import requests


token_request_url = "https://www.flickr.com/services/oauth/request_token"
authorize_url = "https://www.flickr.com/services/oauth/authorize"
access_token_url = "https://www.flickr.com/services/oauth/access_token"

callback = 'https://flickr.com'
apikey = '5b5735907b2fc27180f61c658624f3c6'
apisecret = '1c8a1fe350a2c875'

params = {
	'oauth_timestamp': str(int(time.time())),
	'oauth_signature_method':"HMAC-SHA1",
	'oauth_version': "1.0",
	'oauth_callback': callback,
	'oauth_nonce': oauth.generate_nonce(),
	'oauth_consumer_key': apikey
}

# Setup the Consumer with the api_keys given by the provider
consumer = oauth.Consumer(key=apikey, secret=apisecret)

# Create our request. Change method, etc. accordingly.
req = oauth.Request(method="GET", url=token_request_url, parameters=params)

# Create the signature
signature = oauth.SignatureMethod_HMAC_SHA1().sign(req,consumer,None)

# Add the Signature to the request
req['oauth_signature'] = signature

# Make the request to get the oauth_token and the oauth_token_secret
# I had to directly use the httplib2 here, instead of the oauth library.
h = httplib2.Http(".cache")
resp, content = h.request(req.to_url(), "GET")

#parse the content
content = content.decode('utf-8')
request_token = dict(urllib.parse.parse_qsl(content))

# Create the token object with returned oauth_token and oauth_token_secret
token = oauth.Token(request_token['oauth_token'], request_token['oauth_token_secret'])

# You need to authorize this app via your browser.
url =  "%s?oauth_token=%s&perms=write" % (authorize_url, request_token['oauth_token'])
webbrowser.open(url)

# Once you get the verified pin, input it
accepted = 'n'
while accepted.lower() == 'n':
    accepted = input('Have you authorized me? (y/n) ')
oauth_verifier = input('What is the PIN? (see oauth_verifier on url) ')
print('\n')

#set the oauth_verifier token
token.set_verifier(oauth_verifier)

# Now you need to exchange your Request Token for an Access Token
# Set the base oauth_* parameters along with any other parameters required
# for the API call.
access_token_parms = {
	'oauth_consumer_key': apikey,
	'oauth_nonce': oauth.generate_nonce(),
	'oauth_signature_method':"HMAC-SHA1",
	'oauth_timestamp': str(int(time.time())),
	'oauth_token':request_token['oauth_token'],
	'oauth_verifier' : oauth_verifier
}

#setup request
req = oauth.Request(method="GET", url=access_token_url, 
	parameters=access_token_parms)

#create the signature
signature = oauth.SignatureMethod_HMAC_SHA1().sign(req,consumer,token)

# assign the signature to the request
req['oauth_signature'] = signature

#make the request
h = httplib2.Http(".cache")
resp, content = h.request(req.to_url(), "GET")

#parse the response
content = content.decode('utf-8')
access_token_resp = dict(urllib.parse.parse_qsl(content))
token = oauth.Token(access_token_resp['oauth_token'], access_token_resp['oauth_token_secret'])


print('******************** TEST ********************')

#Allego foto di esempio, potete usare quella! --> porchetta.jpg

photo_url = 'https://up.flickr.com/services/upload'

data = {
    'oauth_consumer_key': consumer.key,
    'oauth_nonce': oauth.generate_nonce(),
    'oauth_signature_method':"HMAC-SHA1",
    'oauth_timestamp': str(int(time.time())),
    'oauth_token': token.key,
    'oauth_version': 1.0,
}

again = 'y'
while again.lower() == 'y':
	
	photo_path = '/home/francesco/Desktop/porchetta.jpg'
	
	req = oauth.Request(method="POST", url=photo_url, parameters=data)
	signature = oauth.SignatureMethod_HMAC_SHA1().sign(req, consumer, token)
	req['oauth_signature'] = signature


	fotoletta = open(photo_path, 'rb').read()
	files = {
		'content-type': 'multipart/form-data',
		'photo': fotoletta
		}
	
	r = oauth.Request(photo_url, parameters=files)
	code = r.status_code
	if(code == 200):
		print('Photo uploaded!')
	print(r)
	again = input('\n\nagain? (y/n) ')
