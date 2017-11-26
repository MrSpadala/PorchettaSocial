import oauth2 as oauth
import time
import httplib2
import urllib
import pika
import flickr_methods

#Globals
host_server = 'rabbitmq'

ex = True
while ex:
	try:
		connection = pika.BlockingConnection(pika.ConnectionParameters(host=host_server))
		ex = False
	except:
		print('FLICKR: Waiting for rabbitmq, retrying in 3 seconds')
		time.sleep(3)
		
		
print('FLICKR: Connected to rabbitmq')

channel = connection.channel()
channel.queue_declare(queue='fkr')


def callback(ch, method, properties, body):
	
	channel1 = connection.channel()
	channel1.queue_declare(queue='to_server', durable=True)
	message = body.decode('utf-8')
	l = message.split('ÿ')

	id_api = 'fkr'
	flag = 'ÿ'
	msg_id = l[0]

	if l[1] == 'upload_post':
		# msg_id ÿ 'upload_post' ÿ access_token ÿ access_tok_secret ÿ text ÿ photo (path)
		access_token = l[2]
		access_token_secret = l[3]
		photo_title = l[4]
		photo_path = l[5]
		
		r = flickr_methods.upload_photo(photo_path, photo_title, access_token, access_token_secret)
	
		risposta = 0
		if ('201' in str(r)):
			risposta = 1
		
		if not risposta:
			stringa_invio =msg_id+flag+id_api+flag+'upload_post'+flag+str(risposta)
			channel1.basic_publish(exchange='',routing_key = 'to_server',body=stringa_invio)
		else: 
			stringa_invio =msg_id+flag+id_api+flag+'upload_post'+flag+'exception_occurred'	
			channel1.basic_publish(exchange='',routing_key = 'to_server',body=stringa_invio)
	else:
		stringa_invio =msg_id+flag+id_api+flag+'upload_post'+flag+'unknown_command'	
		channel1.basic_publish(exchange='',routing_key = 'to_server',body=stringa_invio)
	
	
channel.basic_consume(callback, queue='fkr', no_ack=True)	
print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
