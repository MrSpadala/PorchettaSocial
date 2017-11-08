import pika
#si connette col server rabitmq e crea un canale di comunicazione
connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()
#dichiariamo la coda dal quale prenderemo i messaggi
channel.queue_declare(queue='twt')
#definiamo una funzione con la quale si farà il parsing del messaggio
#e a seconda delle specifiche date nel messaggio, es: comando = auth
#farà certe cose come chiedere un 'autenticazione su twitter ecc
def callback(ch, method, properties, body):
    print(" [x] Received %r" % body)
#qui si prende il messaggio e verrà chiamata la nostra callback
channel.basic_consume(callback,queue='twt',no_ack=True)
#teoricamente questo start consuming dice di prendere a loop tutti i messaggi nella coda fino a quando non terminano
print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()

#da questa parte creiamo un secondo canale con il server di rabbitmq
channel1 = connection.channel()
#definiamo la coda dove poi andremo a scrivere
channel1.queue_declare(queue='to_server')
#qui invece pubblichiamo il body del messaggio che scriveremo dichiarando l'exchange name utilizzato
channel1.basic_publish(exchange='exchange_name',routing_key='qualcosa',body='quello da mandare')

#infine si chiude la connessione

connection.close()
