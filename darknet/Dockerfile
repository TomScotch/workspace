FROM ubuntu
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y git make curl gcc gpp g++ build-essential
RUN cd /opt/ && git clone https://github.com/pjreddie/darknet.git
WORKDIR /opt/darknet
COPY Makefile /opt/darknet/
COPY rnn.c /opt/darknet/src/
RUN make
#RUN curl -O http://pjreddie.com/media/files/vgg-conv.weights
RUN apt-get install -y wget
RUN wget http://pjreddie.com/media/files/yolo.weights
#RUN curl -O http://pjreddie.com/media/files/extraction.weights
#RUN curl -O http://pjreddie.com/media/files/alexnet.weights
#RUN curl -O http://pjreddie.com/media/files/strided.weights
EXPOSE 8888
#CMD ./darknet nightmare cfg/vgg-conv.cfg vgg-conv.weights /data/image.jpg 10 && mv image_vgg-conv_10_000000.png /data/image.jpg
#ENTRYPOINT ["./darknet nightmare cfg/vgg-conv.cfg vgg-conv.weights","image","layer"]
RUN apt-get install -y build-essential \
cmake git libgtk2.0-dev pkg-config libavcodec-dev libavformat-dev libswscale-dev \
python-dev python-numpy libtbb2 libtbb-dev libjpeg-dev libpng-dev libtiff-dev libjasper-dev libdc1394-22-dev
RUN cd /opt/ && git clone https://github.com/opencv/opencv.git
RUN cd /opt/opencv/ && mkdir build && cd build && cmake -D CMAKE_BUILD_TYPE=RELEASE -D CMAKE_INSTALL_PREFIX=/usr/local ..
RUN cd /opt/opencv/build/ && make
RUN cd /opt/opencv/build/ && make install
RUN make clean
COPY Makefile
RUN make
