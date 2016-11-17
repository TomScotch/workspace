FROM debian

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

##############
#start here

RUN git clone https://github.com/nicbou/winston.git /opt/winston
WORKDIR /opt/winston/
RUN apt-get update && apt-get install -y gstreamer0.10-pocketsphinx python-gst0.10 python-gobject pocketsphinx-hmm-en-hub4wsj sphinxbase-utils at festival python-setuptools
RUN python setup.py install
CMD python winston/

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
