FROM tensorflow/tensorflow

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get dist-upgrade -y

RUN apt-get update -y &&    \
	apt-get install -y  \
	nano wget curl git  \
	 build-essential    \
locales ca-certificates     \
software-properties-common

RUN pip install librosa
RUN git clone https://github.com/ibab/tensorflow-wavenet.git /opt/wavenet/
WORKDIR /opt/wavenet/
RUN pip install -r requirements.txt
RUN wget http://homepages.inf.ed.ac.uk/jyamagis/release/VCTK-Corpus.tar.gz
RUN tar xvfz VCTK-Corpus.tar.gz && rm VCTK-Corpus.tar.gz
