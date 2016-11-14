FROM armhf/ubuntu:16.10

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get dist-upgrade -y

RUN apt-get update -y && \
     apt-get install -y  \
	       nano wget \
	        curl git \
	  build-essential ffmpeg sox

WORKDIR /opt/
COPY run-all.sh /opt/
COPY free-usb.sh /opt/
