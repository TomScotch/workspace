FROM        armhf/ubuntu:14.04
RUN         apt-get update && apt-get install -y redis-server git nano python-pycurl curl wget python-redis pywget
RUN	    service redis-server stop
CMD 	    redis-cli -h $DB_PORT_6379_TCP_ADDR
