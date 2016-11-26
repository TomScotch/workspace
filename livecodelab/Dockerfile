FROM ubuntu:16.10

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

RUN apt-get install -y nodejs npm
RUN cd /opt/ && git clone https://github.com/davidedc/livecodelab.git
WORKDIR /opt/livecodelab/
RUN npm install
CMD npm run serve
