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

WORKDIR /opt/

##############
#start here

RUN git clone git://github.com/ninja-ide/ninja-ide.git
RUN apt-get install -y python-pip python-dev 
RUN apt-get install -y python3-sip
RUN pip install virtualenv
RUN cd ninja-ide && pip install -r requirements.txt 
RUN wget https://sourceforge.net/projects/pyqt/files/sip/sip-4.18.1/sip-4.18.1.tar.gz
RUN tar xfv sip-4.18.1.tar.gz
RUN cd sip-4.18.1 && python configure.py CXXFLAGS+=-fno-exceptions && make && make install
RUN apt-get install -y pyqt4-dev-tools pyqt4.qsci-dev

#RUN cd ninja-ide && python ninja-ide.py


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
