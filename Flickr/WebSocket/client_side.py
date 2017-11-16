
import asyncio
import websockets

async def  callback():
    async with websockets.connect('ws://localhost:3000') as websocket:
		###### TODO ########

asyncio.get_event_loop().run_until_complete(callback())
