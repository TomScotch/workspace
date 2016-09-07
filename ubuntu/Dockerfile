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
        #libopencv-dev \
        libprotobuf-dev \
        libsnappy-dev \
        protobuf-compiler \
        python-dev \
        python-numpy \
        python-pip \
        python-scipy && \
    rm -rf /var/lib/apt/lists/*
RUN wget https://bootstrap.pypa.io/ez_setup.py -O - | sudo python
RUN apt-get install -y python-pip-whl
ENV CAFFE_ROOT=/opt/caffe
WORKDIR $CAFFE_ROOT
ENV CLONE_TAG=master
RUN git clone -b ${CLONE_TAG} --depth 1 http://github.com/BVLC/caffe.git .
RUN pip install pip --upgrade
RUN for req in $(cat python/requirements.txt) pydot; do pip install $req; done 
RUN mkdir build && cd build && cmake .. #${CMAKE_ARGS} .. 
RUN cd build && make 
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
#############################################################################################
RUN pip install keras
RUN pip install -r https://raw.githubusercontent.com/Lasagne/Lasagne/master/requirements.txt
Run pip install https://github.com/Lasagne/Lasagne/archive/master.zip
#############################################################################################
RUN apt-get update
RUN apt-get install -y --no-install-recommends \
    curl \
    python \
    python-numpy \
    python-pip

# Install Google Cloud SDK
RUN curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/install_google_cloud_sdk.bash
RUN chmod +x install_google_cloud_sdk.bash
RUN ./install_google_cloud_sdk.bash --disable-prompts --install-dir=/var/gcloud

# Install nightly TensorFlow pip
RUN pip install \
   https://ci.tensorflow.org/view/Nightly/job/nightly-matrix-cpu/TF_BUILD_CONTAINER_TYPE=CPU,TF_BUILD_IS_OPT=OPT,TF_BUILD_IS_PIP=PIP,TF_BUILD_PYTHON_VERSION=PYTHON2,label=cpu-slave/lastSuccessfulBuild/artifact/pip_test/whl/tensorflow-0.10.0rc0-cp27-none-linux_x86_64.whl
RUN mkdir -p /gcs-smoke/python
#############################################################################################
RUN apt-get update
RUN apt-get install -y --no-install-recommends \
    curl \
    python \
    python-numpy \
    python-pip

# Install Google Cloud SDK
RUN curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/install_google_cloud_sdk.bash
RUN chmod +x install_google_cloud_sdk.bash
RUN ./install_google_cloud_sdk.bash --disable-prompts --install-dir=/var/gcloud

# Install kubectl
RUN /var/gcloud/google-cloud-sdk/bin/gcloud components install kubectl

# Install nightly TensorFlow pip
# TODO(cais): Should we build it locally instead?
RUN pip install \
    https://ci.tensorflow.org/view/Nightly/job/nightly-matrix-cpu/TF_BUILD_CONTAINER_TYPE=CPU,TF_BUILD_IS_OPT=OPT,TF_BUILD_IS_PIP=PIP,TF_BUILD_PYTHON_VERSION=PYTHON2,label=cpu-slave/lastSuccessfulBuild/artifact/pip_test/whl/tensorflow-0.10.0rc0-cp27-none-linux_x86_64.whl

# Copy test files
# Copyright 2016 The TensorFlow Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ==============================================================================
#
# Test server for TensorFlow GRPC server
#
# To build the image, use ../build_server.sh
#############################################################################################
# Pick up some TF dependencies
RUN apt-get update && apt-get install -y \
        curl \
        python-numpy \
        python-pip \
        && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN curl -O https://bootstrap.pypa.io/get-pip.py && \
    python get-pip.py && \
    rm get-pip.py

# Install TensorFlow CPU version nightly build
RUN pip --no-cache-dir install \
    https://ci.tensorflow.org/view/Nightly/job/nightly-matrix-cpu/TF_BUILD_CONTAINER_TYPE=CPU,TF_BUILD_IS_OPT=OPT,TF_BUILD_IS_PIP=PIP,TF_BUILD_PYTHON_VERSION=PYTHON2,label=cpu-slave/lastSuccessfulBuild/artifact/pip_test/whl/tensorflow-0.10.0rc0-cp27-none-linux_x86_64.whl


RUN apt-get update

RUN apt-get install -y --no-install-recommends \
    build-essential \
    git \
    software-properties-common

# Install the latest golang
RUN wget https://storage.googleapis.com/golang/go1.4.2.linux-amd64.tar.gz
RUN tar -C /usr/local -xzf go1.4.2.linux-amd64.tar.gz
RUN rm -f go1.4.2.linux-amd64.tar.gz
RUN echo 'PATH=/usr/local/go/bin:${PATH}' >> /root/.bashrc
#############################################################################################
# Pick up some TF dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        curl \
        libfreetype6-dev \
        libpng12-dev \
        libzmq3-dev \
        pkg-config \
        python \
        python-dev \
        rsync \
        unzip \
        && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN curl -O https://bootstrap.pypa.io/get-pip.py && \
    python get-pip.py && \
    rm get-pip.py

RUN pip --no-cache-dir install \
        ipykernel \
        jupyter \
        matplotlib \
        numpy \
        scipy \
        && \
    python -m ipykernel.kernelspec

ENV TENSORFLOW_VERSION 0.10.0rc0
RUN pip --no-cache-dir install \
    http://storage.googleapis.com/tensorflow/linux/cpu/tensorflow-${TENSORFLOW_VERSION}-cp27-none-linux_x86_64.whl
RUN pip install scikit-learn
#############################################################################################
RUN apt-get install python3-numpy python3-scipy python3-dev python3-pip python3-nose g++ libopenblas-dev git
RUN pip install Theano
