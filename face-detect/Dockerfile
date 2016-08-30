FROM armhf/ubuntu:14.04
RUN apt-get update --fix-missing
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

#RUN pip2 install numpy scipy pandas
#RUN pip2 install scikit-learn scikit-image

RUN apt-get install -y python-numpy python-scipy python-pandas python-sklearn python-skimage

RUN DEBIAN_FRONTEND=noninteractive apt-get -y install python-software-properties
RUN DEBIAN_FRONTEND=noninteractive apt-get -y install software-properties-common

RUN apt-get install -y libboost-tools-dev libboost-dev libblas3 libblas-dev

RUN apt-get install -y sudo

COPY install-deps .
RUN ./install-deps
RUN git clone https://github.com/torch/distro.git ~/torch --recursive
RUN cd ~/torch && ./install.sh

RUN ~/torch/install/bin/luarocks install nn
RUN ~/torch/install/bin/luarocks install dpnn
RUN ~/torch/install/bin/luarocks install image
RUN ~/torch/install/bin/luarocks install optim

#RUN cd ~ && \
#    mkdir -p src && \
#    cd src && \
#    curl -L https://github.com/Itseez/opencv/archive/2.4.11.zip -o ocv.zip && \
#   unzip ocv.zip && \
#    cd opencv-2.4.11 && \
#    mkdir release && \
#    cd release && \
#    cmake -D CMAKE_BUILD_TYPE=RELEASE \
#          -D CMAKE_INSTALL_PREFIX=/usr/local \
#          .. && \
#    make -j8 && \
#    make install

RUN cd /root/ && git clone https://github.com/davisking/dlib.git
RUN cd /root/dlib && \
    python setup.py install && \
    cd dlib && cmake . && make && make install && \
    cd /root/dlib/python-examples/ &&  cmake . && make && make install 

WORKDIR /home
RUN git clone https://github.com/mbartoli/openface 

WORKDIR /home/openface/demos/web
RUN sh install-deps.sh
RUN pip install -r requirements.txt

WORKDIR /home/openface/models
RUN sh get-models.sh

WORKDIR /home/openface/demos/web

