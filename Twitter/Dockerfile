 # immagine di python
FROM python:3

WORKDIR /usr/src/app

 # installa le librerie elencate in requirements.txt e copia il codice
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

 # comando di avvio
CMD python twitter_api.py

 # porta esposta (https)
EXPOSE 443

 # se invece si comunica con http 
# EXPOSE 80


