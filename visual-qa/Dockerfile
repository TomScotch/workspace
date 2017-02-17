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

RUN cd /opt/ && git clone https://github.com/VT-vision-lab/VQA_LSTM_CNN.git
WORKDIR /opt/VQA_LSTM_CNN
RUN sudo apt-get update && apt-get install -y libtiff5-dev python-pil python-dev python-numpy 
RUN apt-get install -y libhdf5-serial-dev libhdf5-dev
RUN pip install -r requirements.txt
RUN python -c "import nltk; nltk.download('all')"
