FROM resin/raspberrypi3-python

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
RUN apt-get install python3-dev python3-setuptools libjpeg-dev zlib1g-dev libpng12-dev libfreetype6-dev
RUN apt-get install python3-pip
RUN pip3 install pi3d
RUN pip3 install Pillow

#RUN wget https://github.com/pi3d/pi3d_demos/archive/master.zip
#RUN apt-get install -y unzip
#RUN unzip master.zip
#RUN rm master.zip
#RUN mv pi3d_demos-master pi3d_demos

RUN git clone https://github.com/pi3d/pi3d_demos.git
