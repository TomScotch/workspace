#dockerfile template
#Dockerfile

FROM ubuntu

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get dist-upgrade -y
RUN apt-get update -y && \
     apt-get install -y  \
	       nano wget \
	        curl git \
	 build-essential \
                nodejs npm \
 locales ca-certificates

EXPOSE 4242

RUN mkdir /opt/touchdevelop
WORKDIR touchdevelop

RUN npm install -g http://aka.ms/touchdevelop.tgz
RUN ln /usr/bin/nodejs /usr/bin/node
EXPOSE 4242
