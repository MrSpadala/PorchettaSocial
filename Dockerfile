FROM python:3.6.0

RUN apt-get update -qq && apt-get install -yqq curl
RUN curl -sL https://deb.nodesource.com/setup_9.x | bash 
RUN apt-get install -yqq nodejs
RUN apt-get clean -y

WORKDIR /app


COPY Twitter/requirements.txt Twitter/requirements.txt
COPY Tumblr/requirements.txt  Tumblr/requirements.txt
COPY Flickr/requirements.txt  Flickr/requirements.txt
COPY MainServer/package*.json ./MainServer/

RUN pip3 install -r Twitter/requirements.txt
RUN pip3 install -r Tumblr/requirements.txt
RUN pip3 install -r Flickr/requirements.txt
RUN cd MainServer && npm install && cd ..

COPY . .

CMD node MainServer/mainserver.js & \
    python3 Twitter/twitter_authentication_websocket.py & \
    python3 Tumblr/tumblr_authentication_websocket.py   & \
    python3 Flickr/flickr_authentication_websocket.py   & \
    python3 Twitter/queue_twt.py & \
    python3 Tumblr/queue_tmb.py  & \
    python3 Flickr/queue_fkr.py
