# NOMI CODE, EXCHANGE, SERVER per moduli e code

## Nome di Riferimento per l'Exhcange 

'exchange_name'

Tutti i messaggi del server per i moduli passano attraverso l'exchange, unico, che tramite la routing_key inserisce 
il messaggio nella coda del giusto Social. 

## Nomi di riferimento per le code

tumblr_queue = 'tmb' = routing_key per tumblr

fb_queue = 'fb' = routing_key per facebook

twt_queue = 'twt' = routing_key per twitter

g_queue = 'g+' = routing_key per google plus

to_server_queue = 'to_server'

Le code sono servite dall'exchange, la routing key è uguale al nome stesso della coda, nei moduli dei singoli social si 
dichiara solo la coda del social stesso (non vede l'exchange ne le code di altri social) e la coda di risposta al server.

