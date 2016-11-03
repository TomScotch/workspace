#dockerfile template Dockerfile

FROM armhf/ubuntu:16.10

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

RUN locale-gen de_DE.UTF-8
RUN /usr/sbin/update-locale LANG=de_DE.UTF-8
RUN locale-gen de_DE.UTF-8
ENV LANG de_DE.UTF-8

WORKDIR /opt/

##############
#start here
RUN git clone https://github.com/nicholaslocascio/deep-regex.git
RUN apt-get install -y python-pip python-dev libfreetype6-dev zlib1g-dev python-matplotlib python-setuptools libpng-dev libfreetype6-dev python-lxml libxft2 libxft-dev
RUN wget http://prdownloads.sourceforge.net/libpng/libpng-1.5.4.tar.gz && tar xzf libpng-1.5.4.tar.gz
RUN easy_install pypng
RUN apt-get install -y python-h5py libhdf5-serial-dev libhdf5-dev libhdf5-dev hdf5-tools h5utils
RUN apt-get install -y python-sklearn python-scikits-learn cython
RUN cd libpng-1.5.4 && ./configure --prefix=/opt/libpng-1.5.4/ && make && make install
RUN cd deep-regex && pip install -r requirements.txt 
RUN git clone https://github.com/torch/distro.git ~/torch --recursive
RUN cd torch && bash install-deps && ./install.sh && source ~/.bashrc
RUN cd torch && luarocks install nn
RUN cd torch && luarocks install nngraph
RUN cd torch && luarocks install hdf5

#
#uncomment to install developer tools
#
#apt-get install deb-multimedia-keyring -y
#echo "deb http://www.deb-multimedia.org jessie main non-free" >> /etc/apt/sources.list
#apt-get update
#apt-get install -y ffmpeg


#uncomment for developer tools 
# javascript python ruby
# npm;node/easy_install/bundler;rake;gems
#RUN apt-get update -y && \
#     apt-get install -y  \
#         build-essential \
#                nodejs npm \
#       python-setuptools \
#              python-dev \
# python-mvpa2 protobuf-c-compiler \
# protobuf-compiler libprotobuf-dev \
# libprotoc9 libprotoc-dev libprotobuf9 \
# python-h5py python-lxml python-matplotlib \
# liblapack-dev python-scipy python-numpy \
# python-imaging python-pil python-sklearn \
# ruby-all-dev bundler gems rake


#uncomment for startup entrypoint or command
#ENTRYPOINT ["bash"]
#CMD bash
#EXPOSE 12345

#uncomment to enable user pi
#RUN mkdir /home/pi
#RUN groupadd -r pi -g 433
#RUN useradd -u 431 -r -g pi -d /home/pi -s /sbin/nologin -c "default" pi
#RUN chown -R pi:pi /home/pi
