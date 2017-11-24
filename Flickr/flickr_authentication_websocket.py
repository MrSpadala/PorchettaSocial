import asyncio
import websockets

import flickr_methods

ip_address = '0.0.0.0'
port = 12347
	

async def callback(websocket, path):
	
	stringa = await websocket.recv()
	print(stringa)
	
	l = stringa.split('ÿ')
	print("Received msg splitted ",l)

	flag = 'ÿ'
	name = 'fkr'
	
	if (l[0] == 'auth'):
		request_token, request_token_secret = flickr_methods.get_request_token()
		
		stringa_invio =name+flag+'auth'+flag+flickr_methods.get_url(request_token)+flag+request_token+flag+request_token_secret
		await websocket.send(stringa_invio)
	
	elif l[0] == 'verify_pin':

		pin = l[1]                
		request_token = l[2]
		request_token_secret = l[3]
		stringa_invio = ''
		
		try:
			token1, token2 = flickr_methods.get_access_token(pin, request_token, request_token_secret)
			stringa_invio = name+flag+'verify_pin'+flag+token1+flag+token2

		except Exception:
			stringa_invio =name+flag+'verify_pin'+flag+'exception_occurred'

		await websocket.send(stringa_invio)

		
start_server = websockets.serve(callback, ip_address, port)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
