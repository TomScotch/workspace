from imgurpython import ImgurClient

items = client.gallery()
for item in items:
    print(item.link)
