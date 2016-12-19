FROM ubuntu
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y nano git wget sudo make nodejs npm node-gyp
WORKDIR /opt/
RUN npm install mind -g
