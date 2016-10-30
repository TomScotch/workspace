import os
import urllib
import os.path
from boilerpipe.extract import Extractor

n=0
x=''

for i in range(0,3010):
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
    if os.path.isfile("/opt/scps/scp-" + str(n)) == 0 :
      try:
        text_file = open("/opt/scps/scp-"+str(n)+str('.html'), "w")
        extractor = Extractor(extractor='ArticleExtractor', url="www.scp-wiki.net/scp-"+str(n)+str('.html'))
        text_file.write(extractor.getText())
        text_file.close()
        print "scp-" + str(n) + " downloaded"
      except:
        print 'Wiki Article doesnt exist yet -->' + url 
    else :
      print "scp-"+ str(n) + "  is already existing"
