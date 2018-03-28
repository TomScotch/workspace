FROM wjx0912/cuda_cudnn
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y git make curl gcc gpp g++ build-essential
RUN cd /opt/ && git clone https://github.com/pjreddie/darknet.git
WORKDIR /opt/darknet
COPY Makefile /opt/darknet/
COPY repeat-Nightmare.sh /opt/darknet
COPY lady.jpg /opt/darknet
RUN curl -O http://pjreddie.com/media/files/vgg-conv.weights
RUN curl -O http://pjreddie.com/media/files/extraction.weights
RUN curl -O http://pjreddie.com/media/files/strided.weights
RUN apt-get install -y build-essential cmake libgtk2.0-dev pkg-config libavcodec-dev libavformat-dev libswscale-dev python-dev python-numpy libtbb2 libtbb-dev libjpeg-dev libpng-dev libtiff-dev libjasper-dev libdc1394-22-dev
RUN apt install -y python-opencv libcv-dev
RUN apt install nano wget libopencv-gpu-dev libopencv-dev python-sip-dev binutils-dev -y
#RUN apt update ; apt install nvidia-384 -y
#RUN apt update ; apt install libcuda1-384 -y
RUN make -j 8
