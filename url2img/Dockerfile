FROM node

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

RUN npm install phantomjs-prebuilt
RUN npm install url2img
RUN cd node_modules ; cd phantomjs-prebuilt ; npm install -g .
RUN cd node_modules ; cd url2img ; npm install -g .
