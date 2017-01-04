FROM tensorflow/tensorflow

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

RUN git clone https://github.com/pavelgonchar/colornet.git /opt/colornet
WORKDIR /opt/colornet/
COPY colorize-20160110.tgz.torrent /opt/colornet/
RUN apt install bittorrent  python-tk python-skimage -y
#RUN btdownloadheadless colorize-20160110.tgz.torrent
#RUN tar xvfz colorize-20160110.tgz
#RUN  rm colorize-20160110.tgz && \
#mv colorize-20160110/* . && rm -r colorize-20160110/
