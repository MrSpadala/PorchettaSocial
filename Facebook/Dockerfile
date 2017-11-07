 # versione di python
FROM python:3

WORKDIR /app

 # librerie necessarie in requirements.txt
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
 
 # comando di avvio
CMD python3 facebook_api.py

 # porta esposta
EXPOSE 8080
