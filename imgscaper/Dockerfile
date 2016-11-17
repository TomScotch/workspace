FROM ubuntu:16.10

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get dist-upgrade -y
RUN apt-get update -y && \
     apt-get install -y  \
	       nano wget \
	        curl git \
       python3-setuptools \
              python3-dev python3 \
 locales ca-certificates python3-numpy python3-scipy
 

RUN locale-gen de_DE.UTF-8
RUN /usr/sbin/update-locale LANG=de_DE.UTF-8
RUN locale-gen de_DE.UTF-8
ENV LANG de_DE.UTF-8

RUN cd /opt/ && git clone https://github.com/alexjc/imgscaper.git

WORKDIR /opt/imgscaper/

RUN apt-get update && apt-get install -y python-numpy python-scipy

COPY main.py /opt/imgscaper/
