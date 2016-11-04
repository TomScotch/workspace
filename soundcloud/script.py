import soundcloud

client = soundcloud.Client(access_token="a valid access token")

track = client.post('/tracks', track={
    'title': 'This is a sample track',
    'sharing': 'private',
    'asset_data': open('mytrack.mp4', 'rb')
})

print track.title
