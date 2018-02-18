FROM nvidia/cuda
RUN apt-get update
RUN apt-get -y remove ffmpeg
RUN apt install -y x264 libx264-dev build-essential git yasm nasm unzip wget sysstat nano
RUN cd /opt/ ; git clone https://git.ffmpeg.org/ffmpeg.git
WORKDIR /opt/ffmpeg/
RUN cd ffmpeg ; ./configure --enable-cuda --enable-cuvid --enable-nvenc --enable-nonfree --enable-libnpp --extra-cflags=-I/usr/local/cuda/include --extra-ldflags=-L/usr/local/cuda/lib64
RUN make -j 4
RUN make install
