FROM ubuntu

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

RUN apt-get install -y python-pip
RUN wget https://download.jetbrains.com/python/pycharm-community-2016.3.1.tar.gz
RUN tar xvf pycharm-community-2016.3.1.tar.gz

