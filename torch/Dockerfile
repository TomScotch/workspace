FROM ubuntu
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
