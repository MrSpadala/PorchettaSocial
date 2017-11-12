import pika
from rauth import OAuth1Service
import webbrowser
import json

with open('./app_info/app_info.json','r') as json_data_file:
app_info = json.load(json_data_file)

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))

channel = connection.channel()

channel.queue_declare(queue='fb')

def callback(ch, method, properties, body):
	response_channel = connection.channel()
	response_channel.queue_declare(queue='to_server')
	flag = '\xFF'
	message = (body.decode("utf-8")).split(flag)
	
	msg_id = message[0]
	command = message[1]

	if(command == 'auth'):
		facebook =  OAuth2Service(
			client_id = app['facebook']['id_app'],
			client_secret = app['facebook']['app_secret'],
			name = 'facebook',
			authorize_url = 'https://graph.facebook.com/oauth/authorize',
			access_token_url = 'https://graph.facebook.com/oauth/access_token',
			base_url = 'https://graph.facebook.com')
		
		redirect_uri = 'https://www.facebook.com'

		params = {'scope':'public_profile , publish_actions', 'response_type': 'token', 'redirect_uri' : redirect_uri}
		authorize_url = facebook.get_authorize_url(**params)
		#webbrowser.open(authorize_url)
		url_with_token = read_input('Copy URL from your browser\'s address bar: ')
		access_token = re.search('access_token=([^&]*)', url_with_token).group(1)
		
		msg = msg_id + flag + 'fb' + flag + command + flag + access_token #così gli rimando l'access_token, serve altr?
		response_channel.basic_publish(exchange='', routing_key='to_server',body=msg)
	
	
	elif (command == 'upload_post'): # TODO
	else #TODO
	
	

channel.basic_consume(callback, queue='fb', no_ack = True)
channel.start_consuming()
