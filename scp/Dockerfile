FROM        armhf/ubuntu:14.04
RUN         apt-get update && apt-get install -y redis-server git nano python-pycurl curl wget python-pip
RUN	    easy_install redis
RUN 	    mkdir /data
WORKDIR     /data/
EXPOSE 	    6379
RUN 	    echo 'vm.overcommit_memory = 1' > /etc/sysctl.conf 
RUN	    sysctl vm.overcommit_memory=1
COPY	    redis.conf /data/
RUN 	    redis-server /data/redis.conf --port 6379 >> /dev/null &
COPY scripts/* /data/
