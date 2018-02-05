FROM nvidia/cuda
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
ENV LUA_HASH 33278c2ab5ee3c1a875be8d55c1ca2a1
ENV LUA_MAJOR_VERSION 5.3
ENV LUA_MINOR_VERSION 2
ENV LUA_VERSION ${LUA_MAJOR_VERSION}.${LUA_MINOR_VERSION}
RUN apt-get update && \
    apt-get install -y build-essential curl libreadline-dev && \
    rm -rf /var/lib/apt/lists/* && \
    mkdir /usr/src/lua && \
    cd /usr/src/lua && \
    curl -fSLO http://www.lua.org/ftp/lua-${LUA_VERSION}.tar.gz && \
    echo "${LUA_HASH}  lua-${LUA_VERSION}.tar.gz" | md5sum -c - && \
    tar zxf lua-${LUA_VERSION}.tar.gz && \
    make -C lua-${LUA_VERSION} linux test && \
    make -C lua-${LUA_VERSION} install && \
    rm -rf *.tar.gz lua-${LUA_VERSION} && \
    apt-get purge -y --auto-remove build-essential curl libreadline-dev
ENV LUAROCKS_HASH 5a830953d27715cc955119609f8096e6
ENV LUAROCKS_VERSION 2.2.2
ENV PATH $PATH:/usr/local/luarocks/src/bin
RUN echo "${LUAROCKS_HASH} luarocks-${LUAROCKS_VERSION}.tar.gz" > luarocks-${LUAROCKS_VERSION}.md5 && \
    wget http://luarocks.org/releases/luarocks-${LUAROCKS_VERSION}.tar.gz && \
    md5sum -c luarocks-${LUAROCKS_VERSION}.md5 && \
    tar -xzvf luarocks-${LUAROCKS_VERSION}.tar.gz && \
    cd luarocks-${LUAROCKS_VERSION} && \
    ./configure --lua-version=${LUA_MAJOR_VERSION} && \
    make && make install && \
cd .. && rm -rf *.tar.gz *.md5 luarocks-${LUAROCKS_VERSION}
RUN git clone https://github.com/zeruniverse/neural-colorization.git
WORKDIR /neural-colorization
RUN 	luarocks install torch && \
	luarocks install nn && \
	luarocks install image && \
	luarocks install lua-cjson && \
	luarocks install cutorch && \
	luarocks install cunn && \
	luarocks install cudnn
RUN wget -O model.t7 "https://github.com/zeruniverse/neural-colorization/releases/download/1.0/places2.t7"
RUN mkdir output
