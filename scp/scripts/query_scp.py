import redis

r = redis.Redis(host='localhost',port=6379)

print "type 0 to exit \n"
n = raw_input("please enter scp number : \n")

while n.strip() != 0:
    n = raw_input("Please enter scp number : \n")
    scp = r.get("scp-"+n)
    print scp
