FROM tensorflow/tensorflow

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

RUN git clone https://github.com/Zeta36/tensorflow-tex-wavenet.git /opt/wavenet/
WORKDIR /opt/wavenet/
RUN mkdir /opt/txt && mkdir /opt/text/
ADD train.sh /opt/wavenet/
ADD generate.sh /opt/wavenet/
ADD data.txt /opt/text/
