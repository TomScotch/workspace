FROM nvidia/cuda

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get dist-upgrade -y && \
    apt-get autoremove -y && \
    apt-get autoclean

RUN apt-get update -y &&    \
	apt-get install -y  \
	nano wget curl git  \
	build-essential     \
        ca-certificates     \
        software-properties-common

RUN apt-get install -y cuda
RUN apt-get install -y python-pip python-numpy python-scipy

RUN add-apt-repository ppa:mc3man/trusty-media
RUN apt-get update
RUN apt-get install -y ffmpeg
RUN apt-get install -y frei0r-plugins

RUN pip install theano keras
RUN cd /opt/ && git clone https://github.com/hexagrahamaton/soundcube.git
WORKDIR /opt/soundcube/
RUN pip install git+https://github.com/vishnubob/python-midi

