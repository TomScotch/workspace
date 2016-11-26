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

RUN apt-get install  zlib1g-dev automake autoconf libtool subversion python2.7 libatlas3-base -y
#RUN apt-get install -y libfst4 libfst-dev libfst-tools
RUN git clone https://github.com/kaldi-asr/kaldi.git
RUN cd kaldi/tools && ./extras/check_dependencies.sh && make -j 4 && make install
RUN cd kaldi/src/ && ./configure --shared && make depend && make

