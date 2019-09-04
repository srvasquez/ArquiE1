import requests
import json

request = requests.get('https://api.chucknorris.io/jokes/random').json()
print(request["value"])

