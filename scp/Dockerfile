FROM        armhf/ubuntu:16.10
RUN         apt-get update && apt-get install -y redis-server git nano python-pycurl curl wget python-pip python-redis libxml2 python-lxml
WORKDIR     /opt/
EXPOSE 	    6379
RUN 	    echo 'vm.overcommit_memory = 1' > /etc/sysctl.conf 
COPY	    redis.conf /data/
COPY 	    scripts/* /opt/
RUN         redis-server /data/redis.conf --port 6379 >> /dev/null &
RUN	    apt-get install -y w3m
