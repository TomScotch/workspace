import redis
import sys
import os

r = redis.Redis(host="localhost",port=6379)

r.set("test","test")

if r.get("test") == "test" :
  print "redis ready"
else:
  print "redis fail"

for filename in os.listdir('/data/scp'):
	f = open('/data/scp'+'/'+filename+'.txt', 'w')
        try:
          scp = r.get(filename)
          f.write(scp)
	  f.close()
	except:
          print "Error Scp not found"
