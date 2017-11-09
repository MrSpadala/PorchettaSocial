import pika
from rauth import OAuth1Service
from requests_oauthlib import OAuth1Session


connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

channel.queue_declare(queue='twt')

def callback(ch, method, properties, body):
	channel1 = connection.channel()
	channel1.queue_declare(queue='to_server')
	messagge = body.decode('utf-8')
	#print("messaggio ricevuto:\n"+message)
	l = message.split('ÿ')
	'''
	print(elementi ricevuti e splittati con ÿ)
	for e in l:
		print(e)
	'''
	flag = 'ÿ'
	if (l[0] == 'auth'):
		twitter = OAuth1Service(name='twitter',
                        consumer_key='VyP9pdp6VC1M0qkfS4m14oxqM',
                        consumer_secret='udtYapVuIU3vFalBjRmHWIVPPE6yA9BK4Zwzj6XB1kRcg8ekQq',
                        request_token_url='https://api.twitter.com/oauth/request_token',
                        access_token_url='https://api.twitter.com/oauth/access_token',
                        authorize_url='https://api.twitter.com/oauth/authorize')

        request_token, request_token_secret = twitter.get_request_token(method='POST')

        authorize_url = twitter.get_authorize_url(request_token)
		
		stringa_invio ='twtÿauthÿ'+authorize_url+flag+request_token+flag+request_token_secret
		#print("messaggio inviato:\n"stringa_invio)
		channel1.basic_publish(exchange='',routing_key = 'to_server',body=stringa_invio)
		
	elif l[0] == 'verify_pin':
		twitter = OAuth1Service(name='twitter',
                        consumer_key='VyP9pdp6VC1M0qkfS4m14oxqM',
                        consumer_secret='udtYapVuIU3vFalBjRmHWIVPPE6yA9BK4Zwzj6XB1kRcg8ekQq',
                        request_token_url='https://api.twitter.com/oauth/request_token',
                        access_token_url='https://api.twitter.com/oauth/access_token',
                        authorize_url='https://api.twitter.com/oauth/authorize')
                        
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

		#print("messaggio inviato:\n"stringa_invio)
		channel1.basic_publish(exchange='',routing_key = 'to_server',body=stringa_invio)

	else:
		consumer_key = 'VyP9pdp6VC1M0qkfS4m14oxqM'
		consumer_secret = 'udtYapVuIU3vFalBjRmHWIVPPE6yA9BK4Zwzj6XB1kRcg8ekQq'
		access_token = l[2]
		access_token_secret = l[3]
		oauth = OAuth1Session(consumer_key, client_secret = consumer_secret,resource_owner_key = access_token,resource_owner_secret = access_token_secret)
		params = {'status': 'testo'}

		params['status']=l[1]
		r = oauth.post('https://api.twitter.com/1.1/statuses/update.json', data = params,json=None)
		rispota = 1
		if ('200' in str(r)):
			risposta = 0
		
		stringa_invio ='twtÿupload_postÿ'+risposta
		
		#print("messaggio inviato:\n"stringa_invio)
		channel1.basic_publish(exchange='',routing_key = 'to_server',body=stringa_invio)

		
	

channel.basic_consume(callback,
                      queue='twt',
                      no_ack=True)

print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
