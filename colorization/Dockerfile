FROM bvlc/caffe

#RUN useradd -ms /bin/bash tomscotch
#USER tomscotch
#WORKDIR /home/tomscotch/

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update 
RUN apt-get upgrade -y && \
apt-get dist-upgrade -y && \
apt-get autoremove -y && \
apt-get autoclean

RUN apt-get update -y &&    \
	apt-get install -y  \
	nano wget curl git  \
	build-essential     \
        ca-certificates     \
        software-properties-common

RUN apt-get install -y python-numpy python-scipy python-skimage
RUN pip install --upgrade pip
RUN git clone -b master --single-branch https://github.com/richzhang/colorization.git /opt/colorization/
WORKDIR /opt/colorization/
RUN chmod +x models/fetch_alexnet.sh
RUN sh models/fetch_alexnet_model.sh
