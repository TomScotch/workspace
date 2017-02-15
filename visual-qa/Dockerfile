FROM kaixhin/cuda-keras

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
        software-properties-common python-pip

RUN apt-get install python-dev python-pip python-nose libopenblas-dev git
RUN apt-get install -y python-numpy python-scipy
RUN pip install theano
RUN pip install h5py
RUN pip install keras
RUN apt-get install g++
RUN apt-get install -y unzip libopenblas-base
RUN pip install spacy
RUN python -m spacy.en.download all --force
RUN pip install scikit-learn
RUN pip install progressbar
RUN apt-get install -y libprotobuf-dev libleveldb-dev libsnappy-dev libopencv-dev libhdf5-serial-dev protobuf-compiler
RUN apt-get install -y --no-install-recommends libboost-all-dev
RUN cd /opt/ && git clone https://github.com/avisingh599/visual-qa.git
WORKDIR /opt/visual-qa/scripts
RUN chmod +x get_started.sh
RUN ./get_started.sh
