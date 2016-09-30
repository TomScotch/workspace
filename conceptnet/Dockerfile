FROM armhf/ubuntu

RUN apt-get update -y && \
  apt-get dist-upgrade -y && \
  apt-get upgrade -y && \
  apt-get autoremove -y && \
  apt-get autoclean

RUN apt-get install -y \
      nano wget \
      curl git \
      python-setuptools \
      python-dev python-pip \
      build-essential python-numpy \
      python-scipy python-flask \ 
      make gpp g++

RUN cd /opt/ && git clone https://github.com/commonsense/conceptnet5

WORKDIR /opt/conceptnet5

RUN python setup.py develop
RUN make download_db
RUN ln -s `readlink -f data` ~/.conceptnet5

CMD python -m  conceptnet5.wsgi_web
