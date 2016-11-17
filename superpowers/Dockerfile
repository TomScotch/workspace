FROM ubuntu
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install git build-essential nodejs npm
WORKDIR /opt/
RUN git clone https://github.com/superpowers/superpowers-core superpowers/core
RUN cd superpowers/core && git clone --recursive https://github.com/superpowers/superpowers-game systems/game
RUN cd superpowers/core && npm run build
EXPOSE 4237
EXPOSE 4238
COPY config.json /opt/superpowers/core/
CMD cd superpowers/core && node server start
