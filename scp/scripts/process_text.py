import redis
import os

r = redis.Redis(host='localhost',port=6379)

for filename in os.listdir('/opt/scps/'):
  f = open('/opt/scps'+'/'+filename, 'r')
  content = f.read()
  r.set(filename,content)
