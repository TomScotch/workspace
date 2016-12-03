FROM armhf/ubuntu:16.10
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y nano git wget sudo make nodejs npm 
WORKDIR /opt

RUN npm install browserify -g
RUN apt-get install -y node-gyp
RUN npm install mind && cd node_modules/mind && npm install -g

