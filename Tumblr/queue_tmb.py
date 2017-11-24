import pika
import time
from rauth import OAuth1Service
from requests_oauthlib import OAuth1Session

#Globals
host_server = 'rabbitmq'

ex = True
while ex:
	try:
		connection = pika.BlockingConnection(pika.ConnectionParameters(host=host_server))
		ex = False
	except:
		print('TUMBLR: Waiting for rabbitmq, retrying in 3 seconds')
		time.sleep(3)
		
		
print('TUMBLR: Connected to rabbitmq')

channel = connection.channel()
channel.queue_declare(queue='tmb')


def callback(ch, method, properties, body):
	channel1 = connection.channel()
	channel1.queue_declare(queue='to_server', durable=True)
	message = body.decode('utf-8')
	l = message.split('ÿ', 2)
	print("Received msg splitted ",l)

	flag = 'ÿ'
	msg = l[0]
	if (l[1] == 'upload_post'):
	
		# msg_id ÿ 'upload_post' ÿ access_token ÿ access_tok_secret ÿ text ÿ photo (binary)
		f = 0
		consumer_key = 'BEIrTTq8ALZG8htjrLXGpQIe7Kw7stVN0ZMPLokXhpESscritt'
		consumer_secret = 'IMY60FGZQ2aJp7gTGiLZU5oa9VeU6x1C8h8VIw9UZCGhqHTEUW'
		l = message.split('ÿ', 5)
		access_token = l[2]
		access_token_secret = l[3]
		text = l[4]
		photo = l[5]
		
		oauth = OAuth1Session(consumer_key, client_secret = consumer_secret,resource_owner_key = access_token,resource_owner_secret = access_token_secret)

		r = oauth.get('http://api.tumblr.com/v2/user/info')
		if ('200' in str(r)):
			r = r.json()
			name = r['response']['user']['name']
			stringa = 'http://api.tumblr.com/v2/blog/'+name+'/post'
			
			if (len(photo)>0): 
				params = {'type': 'photo', 'caption' : text, 'data' : photo}
				r = oauth.post(stringa, data = params, json=None).json()
			else:
				params = {'title': '','body':text}
				r = oauth.post(stringa, data = params,json=None).json()
				
			risposta = 1
			if ('201' in str(r)):
				risposta = 0
		
			if not risposta:
				stringa_invio =msg+flag+'tmbÿupload_postÿ'+str(risposta)
				channel1.basic_publish(exchange='',routing_key = 'to_server',body=stringa_invio)
			else: 
				stringa_invio =msg+flag+'tmbÿupload_postÿ'+'exception_occurred'
				channel1.basic_publish(exchange='',routing_key = 'to_server',body=stringa_invio)
		else:
			stringa_invio =msg+flag+'tmbÿupload_postÿ'+'exception_occurred'
			channel1.basic_publish(exchange='',routing_key = 'to_server',body=stringa_invio)
	else:
		stringa_invio = msg+flag+'tmbÿupload_postÿ' + 'unknow command'
		channel1.basic_publish(exchange='', routing_key='to_server', body=stringa_invio)

channel.basic_consume(callback,
                      queue='tmb',
                      no_ack=True)

print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
