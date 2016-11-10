#dockerfile template
#Dockerfile

FROM armhf/ubuntu:16.10

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get dist-upgrade -y

RUN apt-get update -y && \
	apt-get install -y  \
	nano wget curl git  \
	 build-essential    \
locales ca-certificates     \
software-properties-common

RUN locale-gen de_DE.UTF-8
RUN /usr/sbin/update-locale LANG=de_DE.UTF-8
RUN locale-gen de_DE.UTF-8
ENV LANG de_DE.UTF-8

WORKDIR /opt/

##############
#start here

RUN apt-get install -y libboost-dev libboost-date-time-dev libboost-filesystem-dev libboost-program-options-dev libboost-regex-dev libboost-serialization-dev libboost-system-dev libboost-thread-dev cxxtest cmake make gpp gcc g++
RUN git clone https://github.com/opencog/cogutils.git
RUN cd cogutils && mkdir build && cd build && cmake .. && make && make install
RUN git clone https://github.com/opencog/moses.git
RUN apt-get install -y doxygen cython
RUN cd moses && mkdir build && cd build && cmake -DCMAKE_BUILD_TYPE=Release ..
WORKDIR /opt/moses/build/
RUN make
RUN make install

