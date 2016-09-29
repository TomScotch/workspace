import os
import urllib
import os.path

n=0
x=''

for i in range(1,3000):
  if os.path.isfile("scp/scp-" + str(i) + ".htm") == 0 :
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
    try:
      testfile = urllib.URLopener()
      testfile.retrieve(url, "scp/scp-"+str(n)+".htm")
      print url
    except:
      try:
        testfile = urllib.URLopener()
        testfile.retrieve(url, "scp/scp-"+str(n)+".htm")
        print url
      except:
        try:
          testfile = urllib.URLopener()
          testfile.retrieve(url, "scp/scp-"+str(n)+".html")
          print url
        except:
          print 'An error occurred'
  else :
    print "already existing"
