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

WORKDIR /opt/

RUN apt-get install -y python-pip
RUN pip install pip --upgrade
RUN apt-get install -y make gcc gpp g++ cmake automake
RUN apt-get install -y python-setuptools portaudio19-dev
RUN pip install slowclap
#CMD slowclap --exec='echo Clap'
