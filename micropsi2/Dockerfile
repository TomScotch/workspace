#dockerfile template
#Dockerfile

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

##############
#start here
RUN apt-get install python3-setuptools python3-dev libffi-dev python3-matplotlib liblapack3 libblas3 libblas-dev libatlas-base-dev libfreetype6 libxft2 libxft-dev pngtools libpnglite-dev libloadpng4-dev libpng++-dev  liblapack3 libblas3 libblas-dev libatlas3-base libatlas-base-dev python-liblas python-virtualenv -y
RUN cd /opt/ && git clone https://github.com/joschabach/micropsi2.git
WORKDIR /opt/micropsi2/
EXPOSE 6543
RUN apt-get install -y python3-pkgconfig python3-numpy python3-scipy python3-pip
RUN apt-get install python3-matplotlib -y
RUN pip3 install  CherryPy WebOb WebTest beautifulsoup4 cov-core coverage --upgrade
RUN easy_install3 pip && pip3 install pip --upgrade
RUN apt-get install libfreetype6 libxft2 libxft-dev pngtools libpnglite-dev libloadpng4-dev libpng++-dev -y
RUN apt-get install -y liblapack3 libblas3 libblas-dev libatlas3-base libatlas-dev libatlas-base-dev python-liblas
#RUN pip3 install scipy
#RUN pip3 install matplotlib
#RUN pip3 install numpy
#RUN echo " "> requirements.txt
RUN make
COPY config.default.ini /opt/micropsi2/config.ini


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
