import sys
import os

for filename in os.listdir('/opt/scps/'):
      if filename.endswith(".txt") :
        try:
          f = open('/opt/scps/'+filename, 'r')
	  content = f.read()
	  f.close()
	  x = "SCP-" + content.split('Item #: SCP-')
	  y = x[1].split('page revision:')
	  f = open('/opt/scps/'+filename, 'w')
	  f.write(y[0])
	  f.close()
	except:
          f = open('/opt/scps/failed.log', 'w')
          f.write(filename+"\n")
          f.close()
