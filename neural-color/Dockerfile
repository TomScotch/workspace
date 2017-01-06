FROM ubuntu

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

RUN git clone https://github.com/zeruniverse/neural-colorization.git /opt/neural-colorization/

WORKDIR /opt/neural-colorization/

RUN git clone https://github.com/torch/distro.git ~/torch --recursive
RUN apt-get install -y sudo
COPY install-deps /opt/
RUN cd /opt/ && bash install-deps
RUN cd ~/torch && ./install.sh
#RUN source ~/.bashrc
RUN curl -s https://raw.githubusercontent.com/torch/ezinstall/master/install-all | bash

RUN luarocks install torch
RUN luarocks install nn
RUN luarocks install image
RUN luarocks install lua-cjson

RUN wget -O model.t7 "https://github.com/zeruniverse/neural-colorization/releases/download/1.0/places2.t7"

