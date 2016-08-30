FROM armhf/ubuntu
###################################################################################################
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y sudo nano git curl wget
RUN apt-get install -y build-essential
RUN apt-get install -y cmake git libgtk2.0-dev pkg-config libavcodec-dev libavformat-dev libswscale-dev
RUN apt-get install -y python-dev python-numpy libtbb2 libtbb-dev libjpeg-dev libpng-dev libtiff-dev libjasper-dev libdc1394-22-dev
WORKDIR /opt
RUN git clone https://github.com/opencv/opencv.git
WORKDIR /opt/opencv
RUN mkdir build
WORKDIR /opt/opencv/build
RUN cmake ..
RUN make
RUN make install
###################################################################################################
RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        cmake \
        git \
        wget \
        libatlas-base-dev \
        libboost-all-dev \
        libgflags-dev \
        libgoogle-glog-dev \
        libhdf5-serial-dev \
        libleveldb-dev \
        liblmdb-dev \
        libopencv-dev \
        libprotobuf-dev \
        libsnappy-dev \
        protobuf-compiler \
        python-dev \
        python-numpy \
        python-pip \
        python-scipy && \
    rm -rf /var/lib/apt/lists/*
RUN apt-get install -y python-pip-whl
ENV CAFFE_ROOT=/opt/caffe
WORKDIR $CAFFE_ROOT
ENV CLONE_TAG=master
RUN git clone -b ${CLONE_TAG} --depth 1 http://github.com/BVLC/caffe.git . && \
    for req in $(cat python/requirements.txt) pydot; do pip install $req; done && \
    mkdir build && cd build && \
    cmake ${CMAKE_ARGS} .. && \
    make -j 2
ENV PYCAFFE_ROOT $CAFFE_ROOT/python
ENV PYTHONPATH $PYCAFFE_ROOT:$PYTHONPATH
ENV PATH $CAFFE_ROOT/build/tools:$PYCAFFE_ROOT:$PATH
RUN echo "$CAFFE_ROOT/build/lib" >> /etc/ld.so.conf.d/caffe.conf && ldconfig
###################################################################################################
WORKDIR /opt
RUN git clone --depth 1 git://git.videolan.org/ffmpeg
WORKDIR /opt/ffmpeg
RUN ./configure --arch=armel --target-os=linux --enable-gpl --enable-nonfree
RUN make
RUN make install
###################################################################################################
RUN apt-get update
RUN apt-get install -y \
    build-essential \
    cmake \
    curl \
    gfortran \
    git \
    libatlas-dev \
    libavcodec-dev \
    libavformat-dev \
    libboost-all-dev \
    libgtk2.0-dev \
    libjpeg-dev \
    liblapack-dev \
    libswscale-dev \
    pkg-config \
    python-dev \
    python-pip \
    wget \
    zip \
    vim \
    apache2

RUN apt-get install -y python-numpy python-scipy python-pandas
RUN apt-get install -y python-sklearn python-skimage
RUN curl -s https://raw.githubusercontent.com/torch/ezinstall/master/install-deps | bash -e
RUN git clone https://github.com/torch/distro.git ~/torch --recursive
RUN cd ~/torch && ./install.sh
RUN ~/torch/install/bin/luarocks install nn
RUN ~/torch/install/bin/luarocks install dpnn
RUN ~/torch/install/bin/luarocks install image
RUN ~/torch/install/bin/luarocks install optim
