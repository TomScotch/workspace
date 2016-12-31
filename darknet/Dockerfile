FROM ubuntu
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y git make curl gcc gpp g++ build-essential
RUN cd /opt/ && git clone https://github.com/pjreddie/darknet.git
WORKDIR /opt/darknet
COPY Makefile /opt/darknet/
COPY rnn.c /opt/darknet/src/
RUN curl -O http://pjreddie.com/media/files/vgg-conv.weights
RUN curl -O http://pjreddie.com/media/files/extraction.weights
RUN curl -O http://pjreddie.com/media/files/strided.weights
RUN apt-get install -y build-essential cmake libgtk2.0-dev pkg-config libavcodec-dev libavformat-dev libswscale-dev python-dev python-numpy libtbb2 libtbb-dev libjpeg-dev libpng-dev libtiff-dev libjasper-dev libdc1394-22-dev
RUN make
