import pika
from rauth import OAuth1Service
from requests_oauthlib import OAuth1Session

#Globals
host_server = 'localhost'

connection = pika.BlockingConnection(pika.ConnectionParameters(host=host_server))
channel = connection.channel()

channel.queue_declare(queue='tmb')

def callback(ch, method, properties, body):
	channel1 = connection.channel()
	channel1.queue_declare(queue='to_server', durable=True)
	message = body.decode('utf-8')
	l = message.split('ÿ')
	print("Received msg splitted ",l)

	flag = 'ÿ'
	msg = l[0]
	if (l[1] == 'auth'):
		tumblr = OAuth1Service(name='tumblr',consumer_key = 'BEIrTTq8ALZG8htjrLXGpQIe7Kw7stVN0ZMPLokXhpESscritt',consumer_secret= 'IMY60FGZQ2aJp7gTGiLZU5oa9VeU6x1C8h8VIw9UZCGhqHTEUW',request_token_url='https://www.tumblr.com/oauth/request_token',access_token_url='https://www.tumblr.com/oauth/access_token',authorize_url='https://www.tumblr.com/oauth/authorize')
		request_token, request_token_secret = tumblr.get_request_token(method='POST')

		authorize_url = tumblr.get_authorize_url(request_token)
		
		stringa_invio =msg+flag+'tmbÿauthÿ'+authorize_url+flag+request_token+flag+request_token_secret
		channel1.basic_publish(exchange='',routing_key = 'to_server',body=stringa_invio)
		
	elif l[1] == 'verify_pin':
		tumblr = OAuth1Service(name='tumblr',consumer_key = 'BEIrTTq8ALZG8htjrLXGpQIe7Kw7stVN0ZMPLokXhpESscritt',consumer_secret= 'IMY60FGZQ2aJp7gTGiLZU5oa9VeU6x1C8h8VIw9UZCGhqHTEUW',request_token_url='https://www.tumblr.com/oauth/request_token',access_token_url='https://www.tumblr.com/oauth/access_token',authorize_url='https://www.tumblr.com/oauth/authorize')
		pin = l[2]                
		request_token = l[3]
		request_token_secret = l[4]
		stringa_invio = ''
		try:
			session = tumblr.get_auth_session(request_token,request_token_secret,method='POST',data={'oauth_verifier': pin})
			token1 = session.access_token
			token2 = session.access_token_secret
			stringa_invio =msg+flag+'tmbÿverify_pinÿ'+token1+flag+token2

		except Exception:
			stringa_invio =msg+flag+'tmbÿverify_pinÿ'+'exception_occurred'

		channel1.basic_publish(exchange='',routing_key = 'to_server',body=stringa_invio)

	else:
		f = 0
		consumer_key = 'BEIrTTq8ALZG8htjrLXGpQIe7Kw7stVN0ZMPLokXhpESscritt'
		consumer_secret = 'IMY60FGZQ2aJp7gTGiLZU5oa9VeU6x1C8h8VIw9UZCGhqHTEUW'
		access_token = l[3]
		access_token_secret = l[4]
		oauth = OAuth1Session(consumer_key, client_secret = consumer_secret,resource_owner_key = access_token,resource_owner_secret = access_token_secret)

		r = oauth.get('http://api.tumblr.com/v2/user/info')
		if ('200' in str(r)):
			r = r.json()
			name = r['response']['user']['name']
			stringa = 'http://api.tumblr.com/v2/blog/'+name+'/post'

			params = {'title': '','body':l[2]}
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
	

channel.basic_consume(callback,
                      queue='tmb',
                      no_ack=True)

print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
