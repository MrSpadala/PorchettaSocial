# il file tumblr_api.py scrive su tumblr post per conto di terzi


# Funzionamento tumblr.py :
     
     - il metodo utilizzato è lo stesso di quello utilizzato per twitter in quanto tumblr utilizza oauth1.0
     
     - se non lo si conosce andare nella cartella twitter e studiare la linkografia messa a disposizione
     
     -le differenze con twitter sono:
	l'oauth_verifier che per twitter corrispondeva al pin è qua invece nel lnk di reindirzzamento
	quindi dopo aver autorizzato l'app la console vi chiederà l'url al quale siete stati reindirizzati
	e su quello effettuerà un parsing per ottenere l'oauth_verifier
	
	altra differenza è che il link che tumblr mette a disposizione per poter postare richiede un 
	blog-id che corisponde al nome dell'utente, quindi ho fatto in modo tale che prima effettuo una get per
	sapere il nome dell'utente e successivamente si possono creare i post sulla sua 'bacheca'

	ah e la risposta 201 che da in realtà significa che è stato postato correttamente solo quello
	

# Funzionamento di RabbitMQ e tumblr_api_queues.py :

       - RabbitMQ è un message broker, accetta e inoltra messaggi. Funziona a 'code', i messaggi viaggiano
         tra RabbitMQ e l'applicazione e vengono immagazzinati dentro di esse (sono essenzialmente buffere di messaggi).
         
       - I messaggi che vogliamo postare su tumblr vengono inviati nella coda dedicata. Vediamone il funzionamento della ricezione dei messaggi:
          
           # Stabiliamo una connessione con i server di RabbitMQ
           connection = pika.BlockingConnection(pika.ConnectionParameters( message-broker ))
           channel = connection.channel()
           
           # Ora dobbiamo assicurarsi che la coda in questione esista ('tmb')           
           channel.queue_declare(queue='tmb')
           
           # Definiamo una funzione 'callback' che verrà chiamata ogni volta che viene ricevuto un messaggio in coda
           channel.basic_consume(callback, queue='tmb', no_ack=True)
           
           # Ciclo infinito che aspetterà l'arrivo di messaggi
           print(' [*] Waiting for messages. CTRL+C to exit')
           channel.start_consuming()
	
	

# Linkografia :
       
       - Api di tumblr https://www.tumblr.com/docs/en/api/v2
       - RabbitMQ : https://www.rabbitmq.com/getstarted.html



