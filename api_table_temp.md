# Exposed API

PorchettaSocial distinguishes two resource types: `auth/` and `home/`. Requests to `auth/` deal with OAuth and
all its redirects, while requests to `home/` get the home page or post to the selected socials.


## auth
| URL                          | Method | Parameters                                | Description                                                                                                                                                    |
|------------------------------|--------|-------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `auth/start/twitter`           | GET    | (url encoded) token1, token2              | Saves the request access token to the server,  this is the first step when granting access                                                                     |
| `auth/landing/twitter`         | GET    | (url encoded) oauth_verifier, oauth_token | This is the OAuth redirect page after the  authorization of the user. It comes with oauth pin (oauth_verifier) and oauth_token (same as  token1 in auth/start) |
| `auth/register_access/twitter` | POST   | (JSON) token1, token2                     | When authentication is complete it saves the access tokens to the user's cookie named 'porkett'                                                                |
| `auth/logout`                 | GET    | none                                      | Logs out from all social networks by clearing 'porkett' cookie                                                                                                 |


 - Except for `auth/logout`, all URLs may end also with `/tumblr` or `/flickr`
 

## home
| URL  | Method | Parameters                        | Description                                                                                                                                                                                                                                                                                                                             |
|------|--------|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| home | GET    | none                              | Gets the home page                                                                                                                                                                                                                                                                                                                      |
| home | POST   | (JSON) data, twt, tmb, fkr, image | Posts to selected social networks.  'data' is the text wrote by the user; 'twt',  'tmb' and 'fkr' can be 'on' if the user selected them; 'image' is the path of the image (if the  user uploaded one). The user must have logged and stored access tokens for the selected socials before posting here. If not, an error page is showed |



