# Restrizioni dimensioni file

Image <= 5 MB

GIF <= 15 MB

Video <= 15 MB

# Modalità di upload

## Chunked Upload:

Prima richiesta con INIT, resource URL https://upload.twitter.com/1.1/media/upload.json. Restituisce un <b>media_id</b> da usare 
per inviare i chunk del file tramite APPEND che restituisce un code 2XXX senza corpo se a buon fine,per terminare uso FINALIZE che
restituisce le info del media (media_id in formato numerico e stringa, dimensione, expires_secs e type), se è presente un campo
'processing_info' significa che il server ha ricevuto tutto ma sta ancora processando e serve fare polling (solitamente avviene
con video e GIF non con immagini), se non c'è il file è pronto [sono tutte POST].

Required fields for INIT:

+ command => INIT 

+ total_bytes 

+ media_type

La prima risposta mi fornisce un expire_after_secs che mi dice entro quando devo aver finito l'upload dei chunk e usato la POST finale, oltre quel tempo il media_id non è valido.
                 
Required fields for APPEND: 

+ command => APPEND

+ media_id => ritornato dal comando INIT

+ media => raw binary file to be uploaded (preferibile) || media_data => base64-encoded file to upload

+ segment_index => number in [0,999] sequential (order: 0,1,2,3....)
                 
Require fields for FINALIZE: 

+ command => FINALIZE

+ media_id => the one returned from INIT, used to APPEND chunks

## Simple Upload

Resource URL https://upload.twitter.com/1.1/media/upload.json, si fa una sola richiesta con il caricamento del file. 

Require fields:

+ media or media_data (raw binary or base64-encoded)

La risposta è un media_id (con versione stringa), expires_after_secs (come sopra) e le info dell'immagine.


Alla fine si esegue una POST normale (come per il tweet di testo) con parametro opzionale media_ids {media_id_list} con media_id_list.length max=4.

