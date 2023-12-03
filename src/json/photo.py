# photo.py
# The point of this file is merely to add the image paths for each hero/alter
# I'll only keep this file in case I need to iterate through hero_names.json again

import json

with open('src/json/hero_names.json', 'r') as file:
    data = json.load(file)

for entry in data:
    # Use MCDB and not cerebro because cerebro apparently doesn't have all the heroes
    entry['herophoto'] = 'https://marvelcdb.com/bundles/cards/' + entry['code'] + '.png'
    entry['alterphoto'] = 'https://marvelcdb.com/bundles/cards/' + entry['code'][:-1] + 'b' + '.png' # replace code's a with b

with open('src/json/hero_names.json', 'w') as file:
    json.dump(data, file, indent=2)