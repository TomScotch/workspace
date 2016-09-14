FROM        armhf/ubuntu:14.04
RUN         apt-get update && apt-get install -y redis-server git nano python-pycurl curl wget python-pip
RUN	    easy_install redis
RUN	    service redis-server start
#redis-cli -h $DB_PORT_6379_TCP_ADDR
LINK	    redis
