from rauth import OAuth1Service
from requests_oauthlib import OAuth1Session
import asyncio
import websockets

server = '127.0.0.1'
port = 12346

async def callback(websocket, path):
	
	
	stringa = await websocket.recv()
	print(stringa)
	
	l = stringa.split('ÿ')
	print("Received msg splitted ",l)

	flag = 'ÿ'
	
	if (l[0] == 'auth'):
		tumblr = OAuth1Service(name='tumblr',consumer_key = 'BEIrTTq8ALZG8htjrLXGpQIe7Kw7stVN0ZMPLokXhpESscritt',consumer_secret= 'IMY60FGZQ2aJp7gTGiLZU5oa9VeU6x1C8h8VIw9UZCGhqHTEUW',request_token_url='https://www.tumblr.com/oauth/request_token',access_token_url='https://www.tumblr.com/oauth/access_token',authorize_url='https://www.tumblr.com/oauth/authorize')
		request_token, request_token_secret = tumblr.get_request_token(method='POST')

		authorize_url = tumblr.get_authorize_url(request_token)
		
		stringa_invio = 'tmbÿauthÿ'+authorize_url+flag+request_token+flag+request_token_secret		
		await websocket.send(stringa_invio)
		
	elif l[0] == 'verify_pin':
		tumblr = OAuth1Service(name='tumblr',consumer_key = 'BEIrTTq8ALZG8htjrLXGpQIe7Kw7stVN0ZMPLokXhpESscritt',consumer_secret= 'IMY60FGZQ2aJp7gTGiLZU5oa9VeU6x1C8h8VIw9UZCGhqHTEUW',request_token_url='https://www.tumblr.com/oauth/request_token',access_token_url='https://www.tumblr.com/oauth/access_token',authorize_url='https://www.tumblr.com/oauth/authorize')
		pin = l[1]                
		request_token = l[2]
		request_token_secret = l[3]
		stringa_invio = ''
		try:
			session = tumblr.get_auth_session(request_token,request_token_secret,method='POST',data={'oauth_verifier': pin})
			token1 = session.access_token
			token2 = session.access_token_secret
			stringa_invio ='tmbÿverify_pinÿ'+token1+flag+token2

		except Exception:
			stringa_invio ='tmbÿverify_pinÿ'+'exception_occurred'

		await websocket.send(stringa_invio)

start_server = websockets.serve(callback, server, port)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()

