import os
import urllib
import os.path

n=0
x=''

for i in range(0,4000):
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
    url = "http://www.scp-wiki.net/printer--friendly//scp-"+str(x)
    if os.path.isfile("/opt/scps/scp-" + str(n)+".html") == 0 :
      try:
        testfile = urllib.URLopener()
        testfile.retrieve(url, "/opt/scps/scp-"+str(n)+str('.html'))
        print "scp-" + str(n) + " downloaded"
      except:
        print 'Wiki Article doesnt exist yet -->' + url 
    else :
      print "scp-"+ str(n) + "  is already existing"
