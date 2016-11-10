#dockerfile template
#Dockerfile

FROM armhf/ubuntu:16.10

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get dist-upgrade -y

RUN apt-get update -y &&    \
	apt-get install -y  \
	nano wget curl git  \
	 build-essential    \
locales ca-certificates     \
software-properties-common

WORKDIR /opt/

##############
#start here
RUN git clone https://github.com/Imgur/imgurpython.git
WORKDIR /opt/imgurpython/
RUN pip install -r requirements.txt
RUN python setup.py install
COPY imgur.sh /opt/imgurpython/
