FROM scotch/miniconda

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get dist-upgrade -y

WORKDIR /opt/

RUN apt-get install python-pip python3-pip python-all-dev python-setuptools python3-setuptools -y
RUN pip install jupyter
RUN /root/miniconda/bin/conda create -n magenta python=2.7 jupyter
RUN pip install magenta

RUN source activate magenta
