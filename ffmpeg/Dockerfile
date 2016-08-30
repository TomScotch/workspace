FROM armhf/ubuntu
WORKDIR /opt
RUN git clone --depth 1 git://git.videolan.org/ffmpeg
WORKDIR /opt/ffmpeg 
RUN ./configure --arch=armel --target-os=linux --enable-gpl --enable-nonfree
RUN make
RUN make install
