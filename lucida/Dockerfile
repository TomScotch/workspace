FROM ubuntu:14.04
RUN apt-get update && \
apt-get upgrade -y && \
apt-get dist-upgrade -y && \
apt-get autoremove -y && \
apt-get autoclean
RUN apt-get install -y git make
RUN cd /opt/ && git clone https://github.com/claritylab/lucida.git
WORKDIR /opt/lucida/
RUN make local
