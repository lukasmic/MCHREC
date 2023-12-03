# photo.py
# The point of this file is merely to add the image paths for each hero/alter
# I'll only keep this file in case I need to iterate through hero_names.json again

import json
import requests
from PIL import Image
from io import BytesIO

with open('src/json/hero_names.json', 'r') as file:
    data = json.load(file)

for entry in data:
    # Use MCDB and not cerebro because cerebro apparently doesn't have all the heroes
    # entry['herophoto'] = 'https://marvelcdb.com/bundles/cards/' + entry['code'] + '.png'
    # entry['alterphoto'] = 'https://marvelcdb.com/bundles/cards/' + entry['code'][:-1] + 'b' + '.png' # replace code's a with b
  

    entry.pop('color1', None)  # Removes 'color1' if exists
    entry.pop('color2', None)  # Removes 'color2' if exists
  
  # response = requests.get(entry['herophoto'])
  # img = Image.open(BytesIO(response.content))

  # width, height = img.size
  # left = width * 0.21
  # top = height * 0.13
  # right = width
  # bottom = height * 0.6

  # img_cropped = img.crop((left, top, right, bottom))
  # img_cropped.save(f'src/images/{entry["code"]}.webp')

with open('src/json/hero_names.json', 'w') as file:
    json.dump(data, file, indent=2)