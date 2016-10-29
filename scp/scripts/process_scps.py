import redis
import sys
import os
import re

TAG_RE = re.compile(r'<[^>]+>')
substring = re.compile(r'[!--&+;><]')

def remove_tags(text):
    text = TAG_RE.sub('', text)
    text = substring.sub(' ',text)
    return text

r = redis.Redis(host='localhost',port=6379)

for filename in os.listdir('/opt/scps/'):
    if filename.endswith(".html") :
        try:
         f = open('/opt/scps'+'/'+filename, 'r')
	 content = f.read()
         x = content.split('wikidot_top')
         y = x[1].split('wikidot_bottom')
         z = y[0].split('Item')
         v = remove_tags(z[1])
         r.set(filename,v)
	except:
	 print 'error - problem with - : ' + filename
