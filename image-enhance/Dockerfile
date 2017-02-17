FROM ubuntu

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

RUN export PROJ_DIR="/opt/image-enhance/"

RUN apt-get update && apt-get dist-upgrade -y && apt-get upgrade -y && apt-get autoremove -y && apt-get autoclean

RUN apt-get install -y python-dev python-numpy python-scipy python-magic python-matplotlib \
libatlas-base-dev libjpeg-dev \
libopencv-dev ipython ipython-notebook python-pandas python-sympy python-nose libcuda1-367

RUN cd /opt/ && git clone https://code.google.com/p/cuda-convnet2/
WORKDIR /opt/cuda_convnet_plus
RUN sh build.sh
RUN cd /opt/ && git clone https://github.com/stephenyan1231/dl-image-enhance.git image-enhance
WORKDIR /opt/image-enhance/py/
RUN pip install -r requirements.txt
CMD python imageEnhancer.py
