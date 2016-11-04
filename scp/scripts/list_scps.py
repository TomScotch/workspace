import sys
import os

for filename in os.listdir('/opt/scps/'):
  if filename.endswith(".html") :
    f = open('/opt/scps'+'/'+filename, 'r')
    name =  filename.split(".html")
    print name[0]

