FROM resin/raspberrypi3-python

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

RUN apt-get install -y python-setuptools python-pip && pip install pip --upgrade

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
############################################
RUN apt-get -y install build-essential libfreetype6-dev \
  libxcb-shm0-dev \
  pkg-config  zlib1g-dev

#RUN wget http://download.videolan.org/pub/x264/snapshots/last_x264.tar.bz2 && tar xjvf last_x264.tar.bz2 && cd x264-snapshot* && PATH="$HOME/bin:$PATH" ./configure --prefix="$HOME/ffmpeg_build" --bindir="$HOME/bin" --enable-static --disable-opencl && PATH="$HOME/bin:$PATH" make && make install && make distclean
#########################
#RUN cd /opt/ && git clone git://git.videolan.org/x264.git
#WORKDIR /opt/x264
#RUN ./configure
#RUN make
#RUN make install
#RUN checkinstall --pkgname=x264 --pkgversion "2:0.`grep X264_BUILD x264.h -m1 | \
#cut -d' ' -f3`.`git rev-list HEAD | wc -l`+git`git rev-list HEAD -n 1 | head -c 7`" \
#--backup=no --default
#RUN apt-get update
#RUN apt-get install -y subversion
#RUN cd /opt/ && svn checkout svn://svn.ffmpeg.org/ffmpeg/trunk ffmpeg
WORKDIR /opt/ffmpeg
##########################
RUN git clone git://git.videolan.org/x264 /opt/x264
RUN cd /opt/x264 && ./configure --host=arm-unknown-linux-gnueabi --enable-static --disable-opencl && make && make install
#######################################
#RUN apt-get update
#RUN apt-get dist-upgrade
#RUN apt-get install -y libx264-dev
##########################
RUN ./configure --arch=armel --target-os=linux --enable-gpl --enable-nonfree --enable-libx264
RUN make
RUN make install
###########################
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y nano git curl wget
RUN apt-get install -y build-essential
RUN apt-get install -y cmake git libgtk2.0-dev pkg-config libavcodec-dev libavformat-dev libswscale-dev
RUN apt-get install -y python-dev python-numpy libtbb2 libtbb-dev libjpeg-dev libpng-dev libtiff-dev libjasper-dev libdc1394-22-dev

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y nano git curl wget
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
