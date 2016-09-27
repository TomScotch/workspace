import redis
import sys
import os

addr = sys.argv[1]
r = redis.Redis(host=addr,port=6379)
r.set("test","test")

if r.get("test") == "test" :
  print "redis ready"
else:
  print "redis fail"

for filename in os.listdir('/data/scp'):
	f = open('/data/scp'+'/'+filename, 'r')
	name =  filename.split(".html")
	n = name[0]
        try:
         print r.get(str(n))
	except:
	 print "ERROR"
