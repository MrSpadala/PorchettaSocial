from rauth import OAuth2Service
import urllib.request , json
import re
import webbrowser

try:
    read_input = raw_input
except NameError:
    read_input = input
 

def response(url):
    with urllib.request.urlopen(url) as response:
        return response.read()


facebook = OAuth2Service(
    client_id='1644609035590682',
    client_secret='ee8ea24e381d8935c67baac8c4f668fb',
    name='facebook',
    authorize_url='https://graph.facebook.com/oauth/authorize',
    access_token_url='https://graph.facebook.com/oauth/access_token',
    base_url='https://graph.facebook.com')

redirect_uri = 'https://www.facebook.com'

params = {'scope': 'public_profile , publish_actions',
          'response_type': 'token',
          'redirect_uri': redirect_uri}

authorize_url = facebook.get_authorize_url(**params)

print('Visit this URL in your browser: {url}'.format(url=authorize_url))
webbrowser.open(authorize_url)

url_with_token = read_input('Copy URL from your browser\'s address bar: ')

# Here we take the access token
access_token = re.search('access_token=([^&]*)', url_with_token).group(1)

# return an authenticated session
session = facebook.get_session(access_token)

# For publish action we need the user id
url = 'https://graph.facebook.com/me?access_token='+access_token
res = response(url)
user_id = (json.loads(res))['id']

msg = { 'status' : 'none' }                 

# Let's write the text to post on facebook                                 
text = read_input("Inserisci il testo da postare: ")
msg['status'] = str(text)

# Structure for the message for a publish action: "/{user-id}/feed?message={message}&access_token={access-token}"
to_post = "/"+user_id+"/feed?message="+str(text)+"&access_token="+access_token
r = session.post(to_post , data = msg , json=None).json()
print(str(r))
