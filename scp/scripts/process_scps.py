import sys
import os

for filename in os.listdir('/opt/scps/'):
      if filename.endswith(".dump") :
        try:
          f = open('/opt/scps/'+filename, 'r')
	  content = f.read()
	  f.close()
	  f = open('/opt/scps/'+filename+".txt", 'w')
	  try:
	    x = content.split("Item #: SCP-")
	    x1 = "SCP-"+ x[1]
	  except:
            x = content.split("black.png")
            x1 = "SCP-"+ x[1]	    
          y = x1.split('revision:')
	  y0 = y[0]
	  f.write(y0)
	  f.close()
	except:
          f = open('/opt/scps/failed.log', 'w')
          f.write(filename+"\n")
          f.close()
