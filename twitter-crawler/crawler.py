from BeautifulSoup import BeautifulSoup as soupy
from urllib import urllib
html = urllib.urlopen($ARGV[1]).read()
soup = soupy(html)
for tweet in soup.find('ol',attrs={'class':'stream-items'}).findAll('li'):
     print tweet.find('p').text
