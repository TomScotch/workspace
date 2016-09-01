FROM armhf/ubuntu
RUN apt-get update --fix-missing
RUN apt-get upgrade -y
RUN apt-get install -y git nano sudo wget curl
WORKDIR /opt
RUN git clone --depth 1 git://git.videolan.org/ffmpeg
WORKDIR /opt/ffmpeg 
RUN ./configure --target-os=linux --enable-gpl --enable-nonfree
RUN make
RUN make install
