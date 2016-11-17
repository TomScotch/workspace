FROM ubuntu
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
RUN cmake -D CMAKE_BUILD_TYPE=Release -D CMAKE_INSTALL_PREFIX=/usr/local ..
RUN make -j 2
RUN sudo make install
CMD bash
