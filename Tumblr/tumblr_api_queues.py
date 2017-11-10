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
	elif(command == 'upload_post'):
		"""TODO"""
	else :
		"""TODO"""
	
	
	
	
channel.basic_consume(callback, queue='tmb', no_ack=True) # We now tell RabbitMQ that this callback function should receive 
                                                          # messages from our queue ('localhost' or 'rabbit-mq')

print(' [*] Waiting for messages. CTRL+C to exit')
channel.start_consuming() # Never-ending loop that waits for data and runs callbacks whenever necessary



