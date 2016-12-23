FROM ubuntu
RUN apt update
RUN apt-get upgrade -y
RUN apt install -y wget git python-setuptools nano sudo pandoc gcc python-dev
RUN easy_install pip
RUN git clone http://github.com/gunthercox/ChatterBot.git /opt/chatterbot
RUN for f in $(cat /opt/chatterbot/requirements.txt ); do pip install $f ; done
RUN for f in $(cat /opt/chatterbot/dev-requirements.txt ); do pip install $f ; done
RUN for f in $(cat /opt/chatterbot/test-requirements.txt ); do pip install $f ; done
WORKDIR /opt/
RUN cd /opt/chatterbot/ && python setup.py install
RUN mkdir data && cd data && wget http://cs.mcgill.ca/~jpineau/datasets/ubuntu-corpus-1.0/ubuntu_dialogs.tgz
