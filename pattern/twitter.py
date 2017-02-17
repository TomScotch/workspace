from pattern.web    import Twitter
from pattern.vector import KNN, count

import sys

twitter = Twitter()
for tweet in twitter.search(sys.argv[1], start=1, count=1):
    print tweet.text.lower()
