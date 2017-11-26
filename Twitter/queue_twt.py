import sys
import pika
import time
from rauth import OAuth1Service
from base64 import b64encode as enc64
from requests_oauthlib import OAuth1Session

flag = 'ÿ'      #message flag

host_server = 'rabbitmq'

ex = True
while ex:
	try:
		connection = pika.BlockingConnection(pika.ConnectionParameters(host=host_server))
		ex = False
	except:
		print('TWITTER: Waiting for rabbitmq, retrying in 3 seconds')
		time.sleep(3)
		
		
print('TWITTER: Connected to rabbitmq')

channel = connection.channel()
channel.queue_declare(queue='twt')


def callback(ch, method, properties, body):
	channel1 = connection.channel()
	channel1.queue_declare(queue='to_server', durable=True)
	message = body.decode('utf-8')
	l = message.split(flag)
	print("Received msg_id splitted ",l)

	msg_id = l[0]
	
	if (l[1] == 'upload_post'):
		# msg_id ÿ 'upload_post' ÿ access_token ÿ access_tok_secret ÿ text ÿ photo (path)
		consumer_key = 'VyP9pdp6VC1M0qkfS4m14oxqM'
		consumer_secret = 'udtYapVuIU3vFalBjRmHWIVPPE6yA9BK4Zwzj6XB1kRcg8ekQq'
		access_token = l[2]
		access_token_secret = l[3]
		text = l[4]
		photo = l[5]
		flag_photo = False
		
		oauth = OAuth1Session(consumer_key, client_secret = consumer_secret,resource_owner_key = access_token,resource_owner_secret = access_token_secret)
		if len(photo) > 0:
			flag_photo = True
			media_info_resp = oauth.post('https://upload.twitter.com/1.1/media/upload.json', data={ 'media_data':enc64(open(photo,'rb').read()) })
			media_info = media_info_resp.json()
			
			if ( not ('200' in str(media_info_resp))):
				stringa_invio = msg_id + flag + 'twtÿupload_postÿ' + 'image error'
				channel1.basic_publish(exchange='', routing_key = 'to_server', body = stringa_invio)

		
		if (flag_photo):
			media_info = media_info.json()
			media_id = media_info['media_id_string']
			params = {'status': text, 'media_ids': [media_id]}
		else:
			params = {'status': text}
		
		r = oauth.post('https://api.twitter.com/1.1/statuses/update.json', data = params,json=None)
		risposta = 1
		if ('200' in str(r)):
			risposta = 0
	
		if not risposta:
			stringa_invio =msg_id+flag+'twtÿupload_postÿ'+str(risposta)
			channel1.basic_publish(exchange='',routing_key = 'to_server',body=stringa_invio)
		else: 
			stringa_invio =msg_id+flag+'twtÿupload_postÿ'+'exception_occurred'
			channel1.basic_publish(exchange='',routing_key = 'to_server',body=stringa_invio)
	else:
		stringa_invio = msg_id+ flag + 'twtÿupload_postÿ' + 'unknow command'
		channel1.basic_publish(exchange='', routing_key = 'to_server', body = stringa_invio)
	

channel.basic_consume(callback,
                      queue='twt',
                      no_ack=True)

print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
