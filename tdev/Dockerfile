FROM ubuntu:16.10

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
       python-setuptools \
              python-dev \
            ruby-all-dev \
       bundler gems rake \
 locales ca-certificates

RUN locale-gen DE.UTF-8
RUN /usr/sbin/update-locale LANG=de_DE.UTF-8
RUN locale-gen DE.UTF-8
ENV LANG de_DE.UTF-8

EXPOSE 4242

RUN mkdir /opt/touchdevelop
WORKDIR touchdevelop

RUN npm install -g http://aka.ms/touchdevelop.tgz
