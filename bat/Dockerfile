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
RUN apt-get install -y python3-setuptools python-dev
RUN cd /opt/ && git clone https://github.com/Gjum/SpockBot.git
RUN apt-get install -y python3-dev libffi-dev libssl-dev python3-openssl
RUN easy_install3 cryptography
RUN cd /opt/SpockBot/ && python3 setup.py install
RUN cd /opt/ && git clone https://github.com/Gjum/Bat.git
WORKDIR /opt/Bat
#CMD python3 start.py

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
