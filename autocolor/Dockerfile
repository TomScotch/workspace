FROM nvidia/cuda

RUN apt-get update && apt-get install -y \

  libprotobuf-dev \

  libleveldb-dev \

  libsnappy-dev \

  libopencv-dev \

  libboost-all-dev \

  libhdf5-serial-dev \

  protobuf-compiler \

  gcc-4.6 \

  g++-4.6 \

  gcc-4.6-multilib \

  g++-4.6-multilib \

  gfortran \

  libjpeg62 \

  libfreeimage-dev \

  libatlas-base-dev \

  git \

  python-dev \

  python-pip \

  bc \

  wget \

  curl \

  unzip \

  cmake \

  liblmdb-dev \

  pkgconf

RUN update-alternatives --install /usr/bin/cc cc /usr/bin/gcc-4.6 30 && \

  update-alternatives --install /usr/bin/c++ c++ /usr/bin/g++-4.6 30 && \

  update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.6 30 && \

  update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-4.6 30

RUN echo "/usr/local/cuda/lib64" > /etc/ld.so.conf.d/cuda.conf && \

  ldconfig

RUN cd /opt && \

  git clone https://github.com/BVLC/caffe.git

RUN cd /opt && wget https://google-glog.googlecode.com/files/glog-0.3.3.tar.gz && \

  tar zxvf glog-0.3.3.tar.gz && \

  cd /opt/glog-0.3.3 && \

  ./configure && \

  make && \

  make install

RUN ldconfig

RUN cd /opt && \

  wget https://github.com/schuhschuh/gflags/archive/master.zip && \

  unzip master.zip && \

  cd /opt/gflags-master && \

  mkdir build && \

  cd /opt/gflags-master/build && \

  export CXXFLAGS="-fPIC" && \

  cmake .. && \

  make VERBOSE=1 && \

  make && \

  make install

RUN cd /opt/caffe && \

  cp Makefile.config.example Makefile.config && \

  echo "CXX := /usr/bin/g++-4.6" >> Makefile.config && \

  sed -i 's/CXX :=/CXX ?=/' Makefile && \

  make all

RUN cd /opt/caffe && \

  (pip install -r python/requirements.txt; easy_install numpy; pip install -r python/requirements.txt) && \

  easy_install pillow

RUN NUMPY_EGG=`ls /usr/local/lib/python2.7/dist-packages | grep -i numpy` && \

  ln -s /usr/local/lib/python2.7/dist-packages/$NUMPY_EGG/numpy/core/include/numpy /usr/include/python2.7/numpy

RUN cd /opt/caffe && \

  make pycaffe

RUN bash -c 'echo "export PATH=/opt/caffe/.build_release/tools:\$PATH" >> ~/.bashrc'

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

WORKDIR /home/torch
RUN apt-get update && apt-get install -y \
        curl \
        git \
        libpcre3 \
        libpcre3-dev \
        fastjar \
        software-properties-common \
        wget

RUN curl -s https://raw.githubusercontent.com/torch/ezinstall/master/install-deps | bash

RUN git clone https://github.com/torch/distro.git /root/torch --recursive
COPY install-deps /root/torch/
RUN cd /root/torch && bash install-deps
RUN cd /root/torch && ./install.sh -b

WORKDIR /home
RUN luarocks install graphicsmagick # upgrade
RUN luarocks install lua-csnappy
RUN luarocks install md5
RUN luarocks install uuid

RUN git clone --depth 1 https://github.com/nagadomi/waifu2x.git
RUN mv waifu2x/* /home/autocolorization
