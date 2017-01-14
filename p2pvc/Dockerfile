FROM ubuntu

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

RUN apt-get install -y libncurses-dev libopencv-dev portaudio19-dev nano git
RUN cd /opt/ && git clone https://github.com/mofarrell/p2pvc.git
WORKDIR /opt/p2pvc/
RUN make
# CMD ./p2pvc 127.0.0.1 -v
