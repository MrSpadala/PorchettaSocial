from rauth import OAuth1Service
import json

 
try:
    read_input = raw_input
except NameError:
    read_input = input
 
twitter = OAuth1Service(name='twitter',consumer_key='VyP9pdp6VC1M0qkfS4m14oxqM',consumer_secret='udtYapVuIU3vFalBjRmHWIVPPE6yA9BK4Zwzj6XB1kRcg8ekQq',request_token_url='https://api.twitter.com/oauth/request_token',access_token_url='https://api.twitter.com/oauth/access_token',authorize_url='https://api.twitter.com/oauth/authorize')
 

request_token, request_token_secret = twitter.get_request_token(method='POST')

authorize_url = twitter.get_authorize_url(request_token)

print('Visit this URL in your browser: ' + authorize_url)
pin = read_input('Enter PIN from browser: ')


session = twitter.get_auth_session(request_token,request_token_secret,method='POST',data={'oauth_verifier': pin})

params = {'status': 'PORCOIDDIOO'}

while(True):
	post = read_input("Inserisci il tipo di post che vuoi twittare(Ctrl+c per terminare):\n")
	params['status']=str(post)
	r = session.post('https://api.twitter.com/1.1/statuses/update.json', data = params,json=None)
	print(r)

