import redis
import sys
import os

r = redis.Redis(host="localhost",port=6379)

r.set("test","test")

if r.get("test") == "test" :
  print "redis ready"
else:
  print "redis fail"

for name in sys.argv :
        try:
	  print r.get(str(name))
	except:
	 print "not found  - example : scp-2088"
