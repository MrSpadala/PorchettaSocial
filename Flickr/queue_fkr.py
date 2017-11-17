import oauth2 as oauth
import time
import httplib2
import urllib

import pika

#Globals
host_server = 'localhost'

connection = pika.BlockingConnection(pika.ConnectionParameters(host=host_server))
channel = connection.channel()

channel.queue_declare(queue='fkr')

def callback(ch, method, properties, body):
	
	channel1 = connection.channel()
	channel1.queue_declare(queue='to_server', durable=True)
	message = body.decode('utf-8')
	l = message.split('ÿ')
	print("Received msg splitted ",l)

	id_api = 'fkr'
	flag = 'ÿ'
	msg = l[0]
	
	if (l[1] == 'auth'):
		
		request_token, request_token_secret = flickr_methods.get_request_token()
		
		stringa_invio =msg+flag+id_api+flag+'auth'+flag+authorize_url+flag+request_token+flag+request_token_secret
		channel1.basic_publish(exchange='',routing_key = 'to_server',body=stringa_invio)
		
	elif l[1] == 'verify_pin':
		pin = l[2]                
		request_token = l[3]
		request_token_secret = l[4]
		stringa_invio = ''
		try:
			access_token, access_token_secret = flickr_methods.get_access_token(pin, request_token, request_token_secret)
			stringa_invio =msg+flag+id_api+flag+verify_pin+flag+access_token+flag+access_token_secret

		except Exception:
			stringa_invio =msg+flag+id_api+flag+'verify_pin'+flag+'exception_occurred'

		channel1.basic_publish(exchange='',routing_key = 'to_server',body=stringa_invio)

	elif l[1] == 'upload_photo':
		
		photo_path = l[2]
		access_token = l[3]
		access_token_secret = l[4]
		
		r = flickr_methods.upload_photo(photo_path)
			
		risposta = 0
		if ('200' in str(r)):
			risposta = 1
		
		if not risposta:
			stringa_invio =msg+flag+id_api+flag+'upload_photo'+flag+str(risposta)
			channel1.basic_publish(exchange='',routing_key = 'to_server',body=stringa_invio)
		else: 
			stringa_invio =msg+flag+id_app+flag+'upload_photo'+flag+'exception_occurred'	
			channel1.basic_publish(exchange='',routing_key = 'to_server',body=stringa_invio)
	else:
		print("Errore")
	
	
channel.basic_consume(callback, queue='fkr', no_ack=True)	
print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
