FROM sibuzu/cuda-tensorflow

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

RUN cd /opt/ && git clone https://github.com/buriburisuri/speech-to-text-wavenet.git sttw
WORKDIR /opt/sttw/
RUN apt install -y wget && pip install -r requirements.txt
RUN wget http://homepages.inf.ed.ac.uk/jyamagis/release/VCTK-Corpus.tar.gz
RUN mkdir asset/ && mkdir asset/data/
RUN tar xvf VCTK-Corpus.tar.gz asset/data/
