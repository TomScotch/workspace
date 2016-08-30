FROM armhf/ubuntu:latest

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



ENV CAFFE_ROOT=/opt/caffe

WORKDIR $CAFFE_ROOT



# FIXME: clone a specific git tag and use ARG instead of ENV once DockerHub supports this.

ENV CLONE_TAG=master



RUN git clone -b ${CLONE_TAG} --depth 1 https://github.com/BVLC/caffe.git . && \

    for req in $(cat python/requirements.txt) pydot; do pip install $req; done && \

    mkdir build && cd build && \

    cmake ${CMAKE_ARGS} .. && \

    make -j 2



ENV PYCAFFE_ROOT $CAFFE_ROOT/python

ENV PYTHONPATH $PYCAFFE_ROOT:$PYTHONPATH

ENV PATH $CAFFE_ROOT/build/tools:$PYCAFFE_ROOT:$PATH

RUN echo "$CAFFE_ROOT/build/lib" >> /etc/ld.so.conf.d/caffe.conf && ldconfig

WORKDIR /opt
RUN git clone --depth 1 git://git.videolan.org/ffmpeg
WORKDIR /opt/ffmpeg 
RUN ./configure --arch=armel --target-os=linux --enable-gpl --enable-nonfree
RUN make
RUN make install
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y sudo nano git curl wget
RUN apt-get install -y build-essential
RUN apt-get install -y cmake git libgtk2.0-dev pkg-config libavcodec-dev libavformat-dev libswscale-dev
RUN apt-get install -y python-dev python-numpy libtbb2 libtbb-dev libjpeg-dev libpng-dev libtiff-dev libjasper-dev libdc1394-22-dev

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y sudo nano git curl wget
RUN apt-get install -y build-essential
RUN apt-get install -y cmake git libgtk2.0-dev pkg-config libavcodec-dev libavformat-dev libswscale-dev
RUN apt-get install -y python-dev python-numpy libtbb2 libtbb-dev libjpeg-dev libpng-dev libtiff-dev libjasper-dev libdc1394-22-dev
RUN apt-get install -y libcv2.4 libcv-dev libopencv-highgui-dev libopencv-dev libopencv2.4
RUN apt-get install -y python-skimage
WORKDIR /opt
RUN wget http://dl.caffe.berkeleyvision.org/bvlc_googlenet.caffemodel && mv bvlc_googlenet.caffemodel /opt/caffe/models/bvlc_googlenet/
COPY run.sh .
COPY dreamer.py .
CMD bash run.sh
