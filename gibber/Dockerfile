FROM armhf/node

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

WORKDIR /opt/

RUN apt-get --no-install-recommends -y install \
    build-essential pkg-config erlang \
    libicu-dev libmozjs185-dev libcurl4-openssl-dev

RUN git clone https://github.com/charlieroberts/gibber.git gibber
RUN git clone https://github.com/charlieroberts/gibber.server.git gibber.server

WORKDIR	/opt/

RUN npm install gyp
RUN npm install couchbase

RUN cd gibber && npm install
RUN cd gibber.server && ./createDatabase
RUN cd gibber.server && npm install
WORKDIR /opt/gibber/gibber.server
