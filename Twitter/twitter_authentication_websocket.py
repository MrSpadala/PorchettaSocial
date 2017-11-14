from rauth import OAuth1Service
from requests_oauthlib import OAuth1Session
import asyncio
import websockets

async def callback(websocket, path):
	
	
	stringa = await websocket.recv()
	#print(stringa)
	
	l = stringa.split('ÿ')
	#print("Received msg splitted ",l)

	flag = 'ÿ'
	
	if (l[0] == 'auth'):
		twitter = OAuth1Service(name='twitter',consumer_key='VyP9pdp6VC1M0qkfS4m14oxqM',consumer_secret='udtYapVuIU3vFalBjRmHWIVPPE6yA9BK4Zwzj6XB1kRcg8ekQq',request_token_url='https://api.twitter.com/oauth/request_token',access_token_url='https://api.twitter.com/oauth/access_token',authorize_url='https://api.twitter.com/oauth/authorize')
		request_token, request_token_secret = twitter.get_request_token(method='POST')
		authorize_url = twitter.get_authorize_url(request_token)
		
		stringa_invio ='twtÿauthÿ'+authorize_url+flag+request_token+flag+request_token_secret
		
		await websocket.send(stringa_invio)
		
	elif l[0] == 'verify_pin':
		twitter = OAuth1Service(name='twitter',consumer_key='VyP9pdp6VC1M0qkfS4m14oxqM',consumer_secret='udtYapVuIU3vFalBjRmHWIVPPE6yA9BK4Zwzj6XB1kRcg8ekQq',request_token_url='https://api.twitter.com/oauth/request_token',access_token_url='https://api.twitter.com/oauth/access_token',authorize_url='https://api.twitter.com/oauth/authorize')
		pin = l[1]                
		request_token = l[2]
		request_token_secret = l[3]
		stringa_invio = ''
		try:
			session = twitter.get_auth_session(request_token,request_token_secret,method='POST',data={'oauth_verifier': pin})
			token1 = session.access_token
			token2 = session.access_token_secret
			stringa_invio ='twtÿverify_pinÿ'+token1+flag+token2

		except Exception:
			stringa_invio ='twtÿverify_pinÿ'+'exception_occurred'

		await websocket.send(stringa_invio)

start_server = websockets.serve(callback, '127.0.0.1', 12345)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()

