FROM kaixhin/cuda-torch

ENV CUDA_RUN http://developer.download.nvidia.com/compute/cuda/6_5/rel/installers/cuda_6.5.14_linux_64.run

RUN apt-get update && apt-get install -q -y \
  wget git nano sudo curl \
  build-essential 

RUN cd /opt && \
  wget $CUDA_RUN && \
  chmod +x *.run && \
  mkdir nvidia_installers && \
  ./cuda_6.5.14_linux_64.run -extract=`pwd`/nvidia_installers && \
  cd nvidia_installers && \
  ./NVIDIA-Linux-x86_64-340.29.run -s -N --no-kernel-module

RUN cd /opt/nvidia_installers && \
  ./cuda-linux64-rel-6.5.14-18749181.run -noprompt

# Ensure the CUDA libs and binaries are in the correct environment variables
ENV LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/cuda-6.5/lib64
ENV PATH=$PATH:/usr/local/cuda-6.5/bin
RUN apt-get update

RUN apt-get -y install python-pip

RUN apt-get -y install python-skimage

RUN apt-get -y install yasm

RUN pip install numpy matplotlib scipy



WORKDIR /home

RUN wget http://ffmpeg.org/releases/ffmpeg-3.0.1.tar.bz2

RUN tar -xvf ffmpeg-3.0.1.tar.bz2

WORKDIR /home/ffmpeg-3.0.1

RUN ./configure && make && make install



WORKDIR /home

RUN git clone https://github.com/ackimball/autocolorization

WORKDIR /home/autocolorization



RUN wget http://eecs.berkeley.edu/~rich.zhang/projects/2016_colorization/files/demo_v0/colorization_release_v0.caffemodel



RUN apt-get -y install libsnappy-dev

RUN apt-get -y install libgraphicsmagick-dev



#RUN git clone https://github.com/torch/distro.git ~/torch --recursive
#WORKDIR /root/torch
#COPY install-deps /root/torch/
#RUN bash install-deps

#COPY install.sh /root/torch/
#RUN chmod 777 /root/torch/install.sh
#RUN bash $(find /root/torch/ -name install.sh)

WORKDIR /home

RUN luarocks install graphicsmagick # upgrade

RUN luarocks install lua-csnappy

RUN luarocks install md5

RUN luarocks install uuid

RUN git clone --depth 1 https://github.com/nagadomi/waifu2x.git /home/autocolorization/waifu2x
RUN apt-get install pngcrush -y
