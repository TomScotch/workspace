FROM ubuntu:16.10
RUN apt-get update
RUN apt-get dist-upgrade -y

WORKDIR /opt/

RUN apt-get update && apt-get install g++ protobuf-compiler libprotobuf-dev \
                     libboost-dev curl m4 wget libssl-dev

RUN wget https://download.rethinkdb.com/dist/rethinkdb-2.3.5.tgz
RUN tar xf rethinkdb-2.3.5.tgz

WORKDIR /opt/rethinkdb-2.3.5

RUN apt-get install -y python-dev python-pip python-setuptools make curl bzip2 zlib1g zlib1g-dev build-essential

RUN apt-get upgrade -y

RUN apt-get install -y cmake automake gpp cpp g++

RUN apt-get update && apt-get install llvm-3.4-dev \
libghc-crypto-random-dev libcrypto++-dev \
libcrypt-urandom-perl libboost-random-dev

RUN ./configure --with-system-malloc --allow-fetch
RUN make ALLOW_WARNINGS=0
RUN make install ALLOW_WARNINGS=0
EXPOSE 8080
EXPOSE 29015
EXPOSE 28015
CMD rethinkdb --bind all
