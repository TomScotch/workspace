FROM armhf/ubuntu
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y gcc make cmake python python-dev python-setuptools python-pip
WORKDIR /opt
COPY . .
RUN python setup.py install
WORKDIR ~
RUN cobe init
RUN pip install twisted cobe
#CMD cobe console
