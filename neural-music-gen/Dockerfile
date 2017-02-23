FROM nvidia/cuda:latest
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update
RUN apt-get install -y  nano wget curl git gcc g++ gfortran build-essential git wget linux-image-generic libopenblas-dev python-dev python-pip python-nose python-numpy python-scipy python-numpy python-scipy python-dev python-pip python-nose g++ libopenblas-dev git
RUN pip install --upgrade --no-deps git+git://github.com/Theano/Theano.git
RUN cd /opt/ && git clone https://github.com/llSourcell/musicgen.git
WORKDIR /opt/musicgen/
RUN apt-get install -y sox libmp3lame0
RUN apt-get install -y cuda
