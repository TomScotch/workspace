#dockerfile template
#Dockerfile

FROM armhf/ubuntu:16.10

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

RUN cd /opt/ && git clone https://github.com/dbpedia/fact-extractor.git
WORKDIR /opt/fact-extractor/
RUN pip install -r requirements.txt
COPY secrets.py /opt/fact-extractor/libs/
RUN curl http://www.cis.uni-muenchen.de/~schmid/tools/TreeTagger/data/install-tagger.sh | bash
RUN cd /opt/ && git clone https://github.com/cjlin1/libsvm.git
RUN cd /opt/libsvm/ && make

RUN wget https://dumps.wikimedia.org/dewiki/latest/dewiki-latest-pages-articles.xml.bz2
RUN make extract-pages
RUN make extract-news
RUN make extract-sentences-baseline
Run make unsupervised-run
