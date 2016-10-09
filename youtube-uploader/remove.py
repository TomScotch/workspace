import sys

txt = "".join(i for i in sys.argv[1] if ord(i)<128)
print txt.encode("ascii", "ignore")

