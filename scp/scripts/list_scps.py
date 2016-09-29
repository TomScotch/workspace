import sys
import os

scps = ""

for filename in os.listdir('/data/scp'):
  f = open('/data/scp'+'/'+filename, 'r')
  name =  filename.split(".htm")
  n = name[0]
  #scps = scps + " " + n
  print n
