FROM tensorflow/tensorflow

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

RUN git clone https://github.com/pavelgonchar/colornet.git /opt/colornet
WORKDIR /opt/colornet/
COPY colorize-20160110.tgz /opt/colornet/
RUN tar xvfz colorize-20160110.tgz
RUN  rm colorize-20160110.tgz && \
mv colorize-20160110/* .
RUN apt-get install -y python-tk python-skimage
