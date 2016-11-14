import sys
sys.argv[0]=''
txt = ""
c=0
for arg in sys.argv:
  if c<2000 :
    txt = txt+"".join(i for i in arg if ord(i)<128)
    txt = txt + " "
    c = len(txt)

print txt.decode(encoding='UTF-8',errors='strict')
