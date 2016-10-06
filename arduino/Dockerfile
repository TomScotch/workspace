FROM armhf/ubuntu

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get dist-upgrade -y

RUN apt-get update -y &&    \
	apt-get install -y  \
	nano wget curl git  \
	 build-essential    \
locales ca-certificates

WORKDIR /opt/

##############
#start here

RUN apt-get update && apt-get install -y arduino-core arduino-mk
COPY serial-display.cpp .
RUN apt-get install python-serial
RUN apt-get update
RUN apt-get install -y python-dev python-gpiozero wiringpi arduino-core arduino-mk make cpp gpp g++ c++
COPY Makefile .
COPY lcd.c .
RUN make
COPY gpio.py
