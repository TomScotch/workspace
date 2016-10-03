import os
import urllib
import os.path

n=0
x=''

for i in range(1,3060):
    x = i
    n = i
    if len(str(i)) == 1:
      x = str(0) + str(0) + str(i)
      n = str(0) + str(0) + str(0) + str(i)
    if len(str(i)) == 2:
      x = str(0) + str(i)
      n = str(0) + str(0) + str(i)
    if len(str(i)) == 3:
      n = str(0) + str(i)
    url = "http://www.scp-wiki.net/scp-"+str(x)
    if os.path.isfile("/data/scp/scp-" + str(n)) == 0 :
      try:
        testfile = urllib.URLopener()
        testfile.retrieve(url, "/data/scp/scp-"+str(n))
        print "scp-" + str(n) + " downloaded"
      except:
        print 'Wiki Article doesnt exist yet -->' + url 
    else :
      print "scp-"+ str(n) + "  is already existing"
