import redis
import sys
import os
import re

TAG_RE = re.compile(r'<[^>]+>')

def remove_tags(text):
    return TAG_RE.sub('', text)
addr = sys.argv[1]
r = redis.Redis(host=addr,port=6379)

for filename in os.listdir('/data/scp'):
	f = open('/data/scp'+'/'+filename, 'r')
	name =  filename.split(".html")
	n = name[0]
        try:
	 content = f.read()
	 x = content.split('wikidot_top')
	 y = x[1].split('wikidot_bottom')
         z = remove_tags(y[0])
	 r.set(n,z)
	except:
	 print n
