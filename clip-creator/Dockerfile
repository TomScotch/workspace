FROM nvidia/cuda

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get dist-upgrade -y
RUN apt-get purge ffmpeg -y
RUN apt-get install -y git nano
WORKDIR /opt/
RUN git clone https://git.ffmpeg.org/ffmpeg.git
RUN apt install yasm -y
RUN cd ffmpeg ; ./configure --enable-cuda --enable-cuvid --enable-nvenc --enable-nonfree --enable-libnpp --extra-cflags=-I/usr/local/cuda/include --extra-ldflags=-L/usr/local/cuda/lib64 &&  make -j 10
RUN cd ffmpeg ; make install
