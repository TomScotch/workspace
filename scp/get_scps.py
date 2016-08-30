import os
import urllib

for i in range(001,3000):
  if len(str(i)) == 1:
    i=str(0)+str(0)+str(i)
  if len(str(i)) == 2:
    i = str(0) + str(i)
  url = "http://www.scp-wiki.net/scp-"+str(i)
  try:
    testfile = urllib.URLopener()
    testfile.retrieve(url, "scp-"+str(i))
    print url
  except :
    print 'An error occurred'
