import os
import urllib
import os.path

n=0
x=''

for i in range(1,3060):
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
    if os.path.isfile("scp/scp-" + str(n) + ".htm") == 0 :
      try:
        testfile = urllib.URLopener()
        testfile.retrieve(url, "scp/scp-"+str(n)+".htm")
        print "scp-" + n + " downloaded"
      except:
        try:
          testfile = urllib.URLopener()
          testfile.retrieve(url, "scp/scp-"+str(n)+".htm")
          print "scp-" + n + " downloaded"
        except:
          try:
            testfile = urllib.URLopener()
            testfile.retrieve(url, "scp/scp-"+str(n)+".html")
            print "scp-" + n + " downloaded"
          except:
            print 'Wiki Article doesnt exist yet -->' + url 
    else :
      print "scp-"+ n + "  is already existing"
