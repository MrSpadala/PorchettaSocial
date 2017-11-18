'''
L'idea è quella di creare un unico ws che possa gestire tutte le richieste in arrivo.
Per fare ciò sarebbe opportuno modificare il formato dei messaggi in arrivo nel seguente modo:

 id_api | command | param1 | param2 | ... 

che poi vengono gestiti dai rispettivi handler.
'''

import asyncio
import websockets

import handlers

ip_address = '127.0.0.1'
port = 12345				

async def callback(websocket, path):
	
	stringa = await websocket.recv()
	print(stringa)
	
	l = stringa.split('ÿ')
	print("Received msg splitted ",l)
	
	id_api = l[0]
	l = l[1:]
	
	stringa_invio = ''
	
	if(id_api == 'twt'):
		stringa_invio = twitter_handler(l)
		
	elif(id_api == 'tmb'):
		stringa_invio = tumblr_handler(l)
		
	elif(id_api == 'fkr'):
		stringa_invio = flickr_handler(l)
		
	elif(id_api == 'fb'):
		stringa_invio = facebook_handler(l)
		
	else:
		print("Errore")
		
	await websocket.send(stringa_invio)

		
start_server = websockets.serve(callback, ip_address, port)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()		


