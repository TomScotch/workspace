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

RUN cd /opt/ && git clone https://github.com/buriburisuri/speech-to-text-wavenet.git stt
WORKDIR /opt/stt/
RUN apt-get install -y python-pip python-numpy
RUN pip install -r requirements.txt

