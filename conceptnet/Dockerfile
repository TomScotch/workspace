FROM armhf/ubuntu

RUN apt-get update -y && \
  apt-get dist-upgrade -y && \
  apt-get upgrade -y && \
  apt-get autoremove -y && \
  apt-get autoclean

RUN apt-get install -y \
      nano wget \
      curl git \
      python3-setuptools \
      python3-dev python3-pip \
      build-essential python3-numpy \
      python3-scipy python3-flask \ 
      make gpp g++ python3 ipython3

ENV PYTHON python3
RUN cd /root/ && git clone https://github.com/commonsense/conceptnet5 conceptnet
WORKDIR /root/conceptnet
RUN python3 setup.py develop
RUN pip3 install assoc_space==1.0.2
RUN pip3 install wordfreq==1.0
RUN python3 -c 'import nltk; nltk.download("wordnet")'
ENV CONCEPTNET_DATA /root/conceptnet/data
RUN easy_install3 gunicorn
CMD python3 -m conceptnet5.wsgi_web
EXPOSE 8084
EXPOSE 80
EXPOSE 10054
