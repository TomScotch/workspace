#!/usr/bin/env python
import sys
from cobe.brain import Brain

b = Brain("cobe.brain")
b.learn("This is the only thing I know!")
print b.reply(sys.argv[1])
