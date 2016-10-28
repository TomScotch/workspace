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
        try:
         f = open('/opt/scps'+'/'+filename, 'r')
	 content = f.read()
         x = content.split('wikidot_top')
         y = x[1].split('wikidot_bottom')
         z = remove_tags(y[0])
         z1 = z.split('Item')
         for arg in z1[1]:
           txt = txt+"".join(i for i in arg if ord(i)<128)
           txt = txt + " "
         r.set(filename,txt)
	except:
	 print 'error - problem with - : ' + filename
