import redis
import sys
import os

r = redis.Redis(host="localhost",port=6379)

r.set("test","test")

if r.get("test") == "test" :
  print "redis ready"
else:
  print "redis fail"

for filename in os.listdir('/opt/scps/'):
 if filename.endswith(".txt") :        
	f = open('/opt/scps/'+'/'+filename, 'r')
        try:
          print r.get(filename)
	except:
          print "Error Scp not found"
