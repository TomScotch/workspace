FROM armhf/ubuntu
RUN apt-get update && apt-get upgrade -y && apt-get install -y wget
WORKDIR /opt/
RUN wget http://downloads.sourceforge.net/project/leica/leica-0.0.1pre.tar.gz
RUN tar xvf leica-0.0.1pre.tar.gz
RUN rm leica-0.0.1pre.tar.gz
RUN apt-get install python3-pip python3-setuptools -y
RUN easy_install3 pip 
RUN pip install --upgrade pip
RUN apt-get install -y python-pygame
RUN apt-get install -y python-skimage
RUN apt-get install -y build-essential
RUN apt-get install -y cmake git libgtk2.0-dev pkg-config libavcodec-dev libavformat-dev libswscale-dev
RUN apt-get install -y python3-dev python3-numpy libtbb2 libtbb-dev libjpeg-dev libpng-dev libtiff-dev libjasper-dev libdc1394-22-dev
WORKDIR /opt
RUN git clone https://github.com/opencv/opencv.git
WORKDIR /opt/opencv
RUN mkdir build
WORKDIR /opt/opencv/build
RUN cmake -D CMAKE_BUILD_TYPE=Release -D CMAKE_INSTALL_PREFIX=/usr/local ..
RUN make
RUN sudo make install
CMD python leica.py

