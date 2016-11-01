import redis
import sys
import os
import re

r = redis.Redis(host='localhost',port=6379)

for filename in os.listdir('/opt/scps/'):
      if filename.endswith(".html") :
        try:
         f = open('/opt/scps'+'/'+filename, 'r')
	 content = f.read()
         x = content.split('wikidot_top')
         y = x[1].split('wikidot_bottom')
         z = y[0].split('Item :')
         r.set(filename,z[0])
	except:
         try:
           f = open('/opt/scps'+'/'+filename, 'r')
           content = f.read()
           x = content.split('wikidot_top')
           y = x[1].split('wikidot_bottom')
           z = y[0].split('8211 x')
           r.set(filename,z[0])
         except:
           f = open('/opt/scps/failed.log', 'a')
           f.write(filename+"\n")
           f.close()
