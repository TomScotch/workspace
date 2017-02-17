FROM ubuntu

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

RUN apt-get install -y python-pip portaudio19-dev python-numpy python-scipy
RUN pip install pyaudio wave wavio
RUN cd /opt/ && git clone https://github.com/MTG/freesound-python.git frpy
WORKDIR /opt/frpy/

