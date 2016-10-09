import sys
sys.argv[0]=''
txt =''
for arg in sys.argv:
  txt = txt+"".join(i for i in arg if ord(i)<128)
  txt = txt + "\n"

print txt.decode(encoding='UTF-8',errors='strict')
