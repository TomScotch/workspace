FROM ubuntu:16.10

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get dist-upgrade -y

RUN apt-get update -y &&    \
	apt-get install -y  \
	nano wget curl git  \
	 build-essential    \
locales ca-certificates

RUN locale-gen de_DE.UTF-8
RUN /usr/sbin/update-locale LANG=de_DE.UTF-8
RUN locale-gen de_DE.UTF-8
ENV LANG de_DE.UTF-8

WORKDIR /opt/

##############
#start here




#
#uncomment to install developer tools
#
#RUN apt-get install deb-multimedia-keyring -y
#RUN echo "deb http://www.deb-multimedia.org jessie main non-free" >> /etc/apt/sources.list

RUN apt-get update
RUN apt-get install -y ffmpeg


#uncomment for developer tools 
# javascript python ruby
# npm;node/easy_install/bundler;rake;gems
RUN apt-get update -y && \
     apt-get install -y  \
         build-essential \
                nodejs npm \
       python-setuptools \
              python-dev \
            ruby-all-dev \
       bundler gems rake \


#uncomment for startup entrypoint or command
#ENTRYPONT ["bash"]
#CMD bash
#EXPOSE 12345

#uncomment to enable user pi
#RUN mkdir /home/pi
#RUN groupadd -r pi -g 433
#RUN useradd -u 431 -r -g pi -d /home/pi -s /sbin/nologin -c "default" pi
#RUN chown -R pi:pi /home/pi

