import asyncio
import websockets

from methods import flickr_methods as flickr

def flickr_handler(l):
	
	stringa_invio = ''
	
	if (l[0] == 'auth'):
		request_token, request_token_secret = flickr.get_request_token()
		
		stringa_invio = name+flag+'auth'+flag+flickr.authorize_url+flag+request_token+flag+request_token_secret
	
	elif l[0] == 'verify_pin':

		pin = l[1]                
		request_token = l[2]
		request_token_secret = l[3]
		
		try:
			access_token, access_token_secret = flickr.get_access_token(pin, request_token, request_token_secret)
			stringa_invio = name+flag+'verify_pin'+flag+access_token+flag+access_token_secret

		except Exception:
			stringa_invio =name+flag+'verify_pin'+flag+'exception_occurred'
		
		return stringa_invio

	
def facebook_handler(l):
	#TODO
	return ''
	
def tumblr_handler(l):
	#TODO
	return ''
	
def twitter_handler(l):
	#TODO
	return ''
