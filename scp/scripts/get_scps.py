import os
import urllib
import os.path
for i in range(001,3000):
  if os.path.isfile("scp/scp-"+str(i)+".htm") == 0 :
    if len(str(i)) == 1:
      i=str(0)+str(0)+str(i)
    if len(str(i)) == 2:
      i = str(0) + str(i)
    url = "http://www.scp-wiki.net/scp-"+str(i)
    try:
      testfile = urllib.URLopener()
      testfile.retrieve(url, "scp/scp-"+str(i)+".htm")
      print url
    except:
      try:
        testfile = urllib.URLopener()
        testfile.retrieve(url, "scp/scp-"+str(i)+".htm")
        print url
      except:
        try:
          testfile = urllib.URLopener()
          testfile.retrieve(url, "scp/scp-"+str(i)+".html")
          print url
        except:
          print 'An error occurred'
  else :
    print "already existing"
