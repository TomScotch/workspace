FROM kaixhin/cuda-torch

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get dist-upgrade -y && \
    apt-get autoremove -y && \
    apt-get autoclean

RUN apt-get update -y &&    \
	apt-get install -y  \
	nano wget curl git  \
	build-essential     \
        ca-certificates     \
        software-properties-common

RUN cd /opt/ && git clone https://github.com/ayushoriginal/NeuralNetwork-ImageQA.git nn-image-qa
WORKDIR /opt/nn-image-qa
RUN sudo apt-get update && apt-get install -y libtiff5-dev python-pil python-dev python-numpy libhdf5-serial-dev libhdf5-dev python-numpy python-scipy python-yaml
RUN pip install nltk keras theano
RUN python -c "import nltk; nltk.download('all')"
