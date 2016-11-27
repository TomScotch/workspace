#dockerfile template
#Dockerfile

FROM armhf/ubuntu:16.10

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

RUN apt-get install -y nodejs npm node-gyp git 
RUN cd /opt/ && git clone https://github.com/davidedc/livecodelab.git 
RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN cd /opt/livecodelab/ && npm install && npm run build
WORKDIR /opt/livecodelab/
EXPOSE 8080
