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

RUN locale-gen de_DE.UTF-8
RUN /usr/sbin/update-locale LANG=de_DE.UTF-8
RUN locale-gen de_DE.UTF-8
ENV LANG de_DE.UTF-8

##############
#start here

RUN apt-get update
RUN apt-get install -y \
    cmake \
    g++ \
    git \
    google-mock \
    libboost-all-dev \
    libeigen3-dev \
    libgflags-dev \
    libgoogle-glog-dev \
    liblua5.2-dev \
    libprotobuf-dev \
    libsuitesparse-dev \
    libwebp-dev \
    ninja-build \
    protobuf-compiler \
    python-sphinx

RUN cd /opt/ && \
git clone https://ceres-solver.googlesource.com/ceres-solver && \
cd ceres-solver && \
mkdir build && \
cd build && cmake .. -G Ninja && \
ninja && \
ninja test && \
ninja install

RUN cd /opt/ && \
git clone https://github.com/googlecartographer/cartographer.git && \
cd cartographer/ && \
mkdir build && \
cd build && \
cmake .. -G Ninja && \
ninja && \
ninja test && \
ninja install

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
