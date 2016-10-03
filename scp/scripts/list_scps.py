import sys
import os

for filename in os.listdir('/data/scp/'):
  f = open('/data/scp'+'/'+filename, 'r')
  name =  filename.split(".htm")
  print name[0]

