FROM ubuntu

#RUN useradd -ms /bin/bash tomscotch
#USER tomscotch
#WORKDIR /home/tomscotch/

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update 
RUN apt-get upgrade -y && \
apt-get dist-upgrade -y && \
apt-get autoremove -y && \
apt-get autoclean

RUN apt-get update -y &&    \
	apt-get install -y  \
	nano wget curl git  \
	build-essential     \
        ca-certificates     \
        software-properties-common

RUN git clone https://github.com/cameronfabbri/Colorful-Image-Colorization.git /opt/colorful/
WORKDIR /opt/colorful/
RUN apt-get install -y python-setuptools libcv2.4 python-opencv
RUN easy_install pip
RUN pip install tensorflow numpy
