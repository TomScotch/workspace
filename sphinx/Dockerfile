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

WORKDIR /opt/

RUN apt-get update
RUN apt-get upgrade -y 
RUN apt-get install bison -y
RUN apt-get install libasound2-dev automake -y libtool python-dev swig doxygen liblapack3 liblapack-dev libclapack-dev libclapack3
RUN cd /opt/ && git clone https://github.com/cmusphinx/sphinxbase.git && cd sphinxbase  && ./autogen.sh && ./configure --enable-fixed && make && make install
RUN git clone https://github.com/cmusphinx/pocketsphinx.git && cd pocketsphinx && ./autogen.sh &&./configure && make && make install
RUN export LD_LIBRARY_PATH=/usr/local/lib 
RUN export PKG_CONFIG_PATH=/usr/local/lib/pkgconfig
#CMD pocketsphinx_continuous -inmic yes
RUN apt-get install libpocketsphinx3 -y
