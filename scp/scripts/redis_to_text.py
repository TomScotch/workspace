import redis
import sys
import os

r = redis.Redis(host="localhost",port=6379)

r.set("test","test")

if r.get("test") != "test" :
  print "redis fail"

for filename in os.listdir('/opt/scps/'):
      if filename.endswith(".html") :
        try:
          scp = r.get(filename)
	  if scp=="none" :
            f = open('/opt/scps/empty.log','a')
            f.write(filename+"\n")
            f.close()
          else :
            f = open('/opt/scps/'+'/'+filename+'.txt', 'w')
            f.write(scp)
            f.close()
	except:
          f = open('/opt/scps/missing.log','a')
          f.write(filename+"\n")
          f.close()
