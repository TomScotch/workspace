#dockerfile template
#Dockerfile

FROM ubuntu

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

RUN cd /opt/ && git clone https://github.com/MTG/freesound-python.git freesound

WORKDIR /opt/freesound/

RUN apt-get install -y python-pip sox
RUN pip install freesound
