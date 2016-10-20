#examples

# use this to get a sbort summarize of
# github in german
# python wiki.py de github 1 

# use this to get the english wiki page 
# content for microsoft
# python wiki.py en microsoft 0

import wikipedia
import sys

lang="en"
search=""
summary=0

#if sys.argv != "" :
#lang = sys.argv[1]

#if sys.argv[2] != "" :
search = sys.argv[1]
wikipedia.set_lang(lang)
txt =''

#if sys.argv[3] == "a" :
content = wikipedia.summary(search)  
for word in content:
  txt = txt+"".join(i for i in word if ord(i)<128)

#if sys.argv[3] == "b" :
#  page = wikipedia.page(search)
#  content = page.content
#  for word in content:
#    txt = txt+"".join(i for i in word if ord(i)<128)

print txt
