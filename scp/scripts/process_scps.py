import sys
import os
import os.path

for filename in os.listdir('/opt/scps/'):
   if filename.endswith(".dump") :
      if os.path.isfile(filename+".txt") == 0 :
          try:
            f = open('/opt/scps/'+filename, 'r')
            content = f.read()
	    f.close()
	    f = open('/opt/scps/'+filename+".txt", 'w')
	    try:
	      x = content.split("Item #: SCP-")
	      x1 = "SCP " + x[1]
	    except:
              x = content.split("black.png")
              x1 = x[1]+" "
            try:
              y = x1.split('page revision:')
              y0 = y[0]
            except:
              y = x1.split('last edited:')
              y0 = y[0]
	    f.write(y0)
	    f.close()
	  except:
            f = open('/opt/scps/fail.log', 'w')
            f.write(filename+"\n")
            f.close()
