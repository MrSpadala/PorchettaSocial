import pika
from rauth import OAuth1Service
import webbrowser
import json

# Establish a connection with RabbitMQ server
connection = pika.BlockingConnection(pika.ConnectionParameters('localhost')) # broker = 'localhost' for tests
                                                                             # broker = 'rabbit-mq' for PorchettaSocial
channel = connection.channel()

channel.queue_declare(queue='tmb') # Here we make sure that the queue exists


# Whenever we receive a message, this callback function is called by the Pika library.
def callback(ch, method, properties, body):
	#print("message = " + body.decode("utf-8") + "\n")
	
	response_channel = connection.channel()
	response_channel.queue_declare(queue = 'to_server')
	flag = '\xFF'
	message = (body.decode("utf-8")).split(flag)
	command = message[1]
	
	if(command == 'auth' ):
		"""TODO"""
		# da prendere in tumblr_api.py
	elif(command == 'upload_post'):
		"""TODO"""
		text = message[2] #da RPC_FORMAT il messaggio è msg_id|cmd|messaggio|token|...
		access_token = message[3]
		access_token2 = message[4] #secondo access token, tumblr usa oAuth1
		
		tumblr = OAuth1Service(name='tumblr', consumer_key='',consumer_secret='',request_token_url='',access_token_url='',authorize_url='')
                session = tumblr.get_auth_session(access_token,access_token2,method='POST',data={'oauth_verifier': #codice, tocca passarlo?})
		s = session.get('http://api.tumblr.com/v2/user/info').json()
		blog_id = s['response']['user']['blog_id']
		tumblr_post_string = "https://api.tumblr.com/v2/blog/"+blog_id+"/post"
												 
		params['body'] = text
		s = session.post(tumblr_post_string, data = params, json=None).json()

                #la risposta generata in formato 201:Created o Error Code viene formattata inserendo il msg_id = message[0]
		#inviare in coda il messaggio di risposta qui
		#channel.basic_publish(exchange='',routing_jey='to_server',body= // risposta // )

		 
	else :
		"""TODO"""
	
	
	
	
channel.basic_consume(callback, queue='tmb', no_ack=True) # We now tell RabbitMQ that this callback function should receive 
                                                          # messages from our queue ('localhost' or 'rabbit-mq')

print(' [*] Waiting for messages. CTRL+C to exit')
channel.start_consuming() # Never-ending loop that waits for data and runs callbacks whenever necessary



