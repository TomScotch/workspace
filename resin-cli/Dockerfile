FROM google/nodejs

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

COPY ~/.ssh/id_rsa.pub ~/.ssh/

RUN npm install -g resin
RUN npm install -g resin-cli

CMD resin sync --source /data --destination /opt
