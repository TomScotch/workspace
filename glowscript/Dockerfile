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

RUN cd /opt/ && git clone https://github.com/BruceSherwood/glowscript.git
RUN cd /opt/ && wget https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-135.0.0-linux-x86.tar.gz
RUN cd /opt/ && tar xfv google-cloud-sdk-135.0.0-linux-x86.tar.gz
RUN apt-get install -y python python-dev python-pip
RUN cd /opt/ && ./google-cloud-sdk/install.sh
WORKDIR /opt/
#CMD python /google-cloud-sdk/bin/dev_appserver.py /glowscript
EXPOSE 8080
EXPOSE 8000
EXPOSE 35250
