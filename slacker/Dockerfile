FROM armhf/ubuntu

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get dist-upgrade -y
RUN apt-get update -y && \
     apt-get install -y  \
	       nano wget \
	        curl git \
         build-essential \
       python-setuptools \
   python-dev python-pip 

WORKDIR /opt/

RUN easy_install slacker

RUN wget https://gist.githubusercontent.com/TomScotch/c0b4a9dda3584d17d7261c9708598149/raw/c7ba0615fb5d7725ed3a46b278714dc56f0232b5/slacker.py

