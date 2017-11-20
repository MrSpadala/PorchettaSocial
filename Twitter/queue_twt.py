import pika
from rauth import OAuth1Service
from requests_oauthlib import OAuth1Session

host_server = 'localhost'

connection = pika.BlockingConnection(pika.ConnectionParameters(host=host_server))
channel = connection.channel()

channel.queue_declare(queue='twt')

def callback(ch, method, properties, body):
	channel1 = connection.channel()
	channel1.queue_declare(queue='to_server', durable=True)
	message = body.decode('utf-8')
	l = message.split('ÿ', 2)
	print("Received msg splitted ",l)

	flag = 'ÿ'
	msg = l[0]
	if (l[1] == 'auth'):
		twitter = OAuth1Service(name='twitter',consumer_key='VyP9pdp6VC1M0qkfS4m14oxqM',consumer_secret='udtYapVuIU3vFalBjRmHWIVPPE6yA9BK4Zwzj6XB1kRcg8ekQq',request_token_url='https://api.twitter.com/oauth/request_token',access_token_url='https://api.twitter.com/oauth/access_token',authorize_url='https://api.twitter.com/oauth/authorize')
		request_token, request_token_secret = twitter.get_request_token(method='POST')
		authorize_url = twitter.get_authorize_url(request_token)
		
		stringa_invio =msg+flag+'twtÿauthÿ'+authorize_url+flag+request_token+flag+request_token_secret
		channel1.basic_publish(exchange='',routing_key = 'to_server',body=stringa_invio)
		
	elif l[1] == 'verify_pin':
		twitter = OAuth1Service(name='twitter',consumer_key='VyP9pdp6VC1M0qkfS4m14oxqM',consumer_secret='udtYapVuIU3vFalBjRmHWIVPPE6yA9BK4Zwzj6XB1kRcg8ekQq',request_token_url='https://api.twitter.com/oauth/request_token',access_token_url='https://api.twitter.com/oauth/access_token',authorize_url='https://api.twitter.com/oauth/authorize')
		l = message.split('ÿ')
		pin = l[2]                
		request_token = l[3]
		request_token_secret = l[4]
		stringa_invio = ''
		try:
			session = twitter.get_auth_session(request_token,request_token_secret,method='POST',data={'oauth_verifier': pin})
			token1 = session.access_token
			token2 = session.access_token_secret
			stringa_invio =msg+flag+'twtÿverify_pinÿ'+token1+flag+token2

		except Exception:
			stringa_invio =msg+flag+'twtÿverify_pinÿ'+'exception_occurred'

		channel1.basic_publish(exchange='',routing_key = 'to_server',body=stringa_invio)

	elif l[1] == 'upload_post':
	
		# msg_id ÿ 'upload_post' ÿ access_token ÿ access_tok_secret ÿ text ÿ photo (binary)
		f = 0
		consumer_key = 'VyP9pdp6VC1M0qkfS4m14oxqM'
		consumer_secret = 'udtYapVuIU3vFalBjRmHWIVPPE6yA9BK4Zwzj6XB1kRcg8ekQq'
		l = message.split('ÿ', 5)
		access_token = l[2]
		access_token_secret = l[3]
		text = l[4]
		photo = l[5]
		print(text)
		
		if len(photo) > 0:
			# TODO Invia pure la foto
			pass
		print('AAAAAAAAAAAAAAAAAAAAAAAA')
		oauth = OAuth1Session(consumer_key, client_secret = consumer_secret,resource_owner_key = access_token,resource_owner_secret = access_token_secret)

		params = {'status': 'testo'}

		params['status']=text
		r = oauth.post('https://api.twitter.com/1.1/statuses/update.json', data = params,json=None)
		risposta = 1
		if ('200' in str(r)):
			risposta = 0
	
		if not risposta:
			stringa_invio =msg+flag+'twtÿupload_postÿ'+str(risposta)
			channel1.basic_publish(exchange='',routing_key = 'to_server',body=stringa_invio)
		else: 
			stringa_invio =msg+flag+'twtÿupload_postÿ'+'exception_occurred'
			channel1.basic_publish(exchange='',routing_key = 'to_server',body=stringa_invio)

	

channel.basic_consume(callback,
                      queue='twt',
                      no_ack=True)

print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
