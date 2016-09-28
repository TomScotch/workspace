import redis
import sys
import os
import re

TAG_RE = re.compile(r'<[^>]+>')
substring = re.compile(r'[!--&+;><]')

def remove_tags(text):
    text = TAG_RE.sub('', text)
    text = text.replace("nbsp",' ')
    text = substring.sub(' ',text)
    return text

r = redis.Redis(host='localhost',port=6379)

for filename in os.listdir('/data/scp'):
	f = open('/data/scp'+'/'+filename, 'r')
	name =  filename.split(".htm")
	n = name[0]
        try:
	 content = f.read()
	 x = content.split('wikidot_top')
	 y = x[1].split('wikidot_bottom')
         z = remove_tags(y[0])
	 r.set(n,z)
	except:
	 print 'error with ' + n
