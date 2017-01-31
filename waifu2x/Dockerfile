FROM kaixhin/cuda-torch

RUN apt-get update && apt-get install -y --no-install-recommends --force-yes \
  libsnappy-dev \
  graphicsmagick \
  libgraphicsmagick1-dev \
  libssl-dev \
  ca-certificates \
  git && \
  rm -rf /var/lib/apt/lists/*

RUN \
  luarocks install graphicsmagick && \
  luarocks install lua-csnappy && \
  luarocks install md5 && \
  luarocks install uuid && \
  luarocks install csvigo && \
  PREFIX=$HOME/torch/install luarocks install turbo && \
  luarocks install cudnn

# suppress message `tput: No value for $TERM and no -T specified`
ENV TERM xterm

RUN cd /root/ && git clone https://github.com/nagadomi/waifu2x.git
WORKDIR /root/waifu2x
RUN add-apt-repository ppa:heyarje/libav-11 && sudo apt-get update
RUN apt-get install libav-tools -y
RUN apt-get upgrade -y --force-yes 
RUN apt-get dist-upgrade
