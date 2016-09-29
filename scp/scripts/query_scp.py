import redis
import sys
import os

r = redis.Redis(host="localhost",port=6379)

try:
  print r.get(str(sys.argv[1]))
except:
  print "not found"
