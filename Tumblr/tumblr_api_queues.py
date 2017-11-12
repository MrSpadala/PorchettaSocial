import pika
from rauth import OAuth1Service
import webbrowser
import json

with open('./tumblr_info.json' , 'r') as json_data_file:
    app_info = json.load(json_data_file)

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
	msg_id = message[0]
	command = message[1]
	
	if(command == 'auth' ):
		tumblr = OAuth1Service(name='tumblr',
		                       consumer_key = app_info['facebook']['consumer_key'],
		                       consumer_secret = app_info['tumblr']['consumer_secret'],
		                       request_token_url='https://www.tumblr.com/oauth/request_token',
		                       access_token_url='https://www.tumblr.com/oauth/access_token',
		                       authorize_url = 'https://www.tumblr.com/oauth/authorize')
		                       
		request_token,request_token_secret=tumblr.get_request_token(method='POST')
		authorize_url = tumblr.get_authorize_url(request_token)
		response_msg = msg_id + flag + 'tmb' + command + authorize_url + flag + request_token + request_token_secret
		response_channel.basic_publish(exchange='',routing_key = 'to_server', body = response_msg)
		
		
	elif(command == 'upload_post'):
		"""TODO"""
		text = message[2] #da RPC_FORMAT il messaggio è msg_id|cmd|messaggio|token|...
		request_token = message[3]
		request_token_secret = message[4] #secondo access token, tumblr usa oAuth1
		
		tumblr = OAuth1Service(name='tumblr', 
		                       consumer_key = app_info['facebook']['consumer_key'],
		                       consumer_secret = app_info['tumblr']['consumer_secret'],
		                       request_token_url ='https://www.tumblr.com/oauth/request_token',
		                       access_token_url ='https://www.tumblr.com/oauth/access_token',
		                       authorize_url = 'https://www.tumblr.com/oauth/authorize')
		                       
		session = tumblr.get_auth_session(request_token , request_token_secret , method='POST', data={'oauth_verifier': """codice, tocca passarlo?"""})
		r = session.get('http://api.tumblr.com/v2/user/info').json()
		blog_id = s['response']['user']['blog_id']
		tumblr_post_string = "https://api.tumblr.com/v2/blog/"+blog_id+"/post"
												 
		params['body'] = text
		r = session.post(tumblr_post_string, data = params, json=None).json()

        #la risposta generata in formato 201:Created o Error Code viene formattata inserendo il msg_id = message[0]
		#inviare in coda il messaggio di risposta qui
		#channel.basic_publish(exchange='',routing_jey='to_server',body= // risposta // )
		
		"""DA CONFERMARE"""
		result = r['meta']['msg'] # Potrebbe essere "Created" , "Bad Request" , ecc... a seconda del risultato dell'operazione
		response_msg = msg_id + flag + 'tmb' + flag + command + flag + result
		response_channel.basic_publish(exchange='',routing_key = 'to_server', body = response_msg)

		 
	else :
		"""TO DEFINE"""
	
	
	
	
channel.basic_consume(callback, queue='tmb', no_ack=True) # We now tell RabbitMQ that this callback function should receive 
                                                          # messages from our queue ('localhost' or 'rabbit-mq')

print(' [*] Waiting for messages. CTRL+C to exit')
channel.start_consuming() # Never-ending loop that waits for data and runs callbacks whenever necessary



