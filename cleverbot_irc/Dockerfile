FROM node
RUN apt-get update
RUN apt-get upgrade -y
WORKDIR /opt/
RUN apt update ; apt-get install -y wget nano sudo git nodejs npm
RUN ln /usr/bin/nodejs /usr/bin/node
RUN npm install cleverbot-irc
COPY .clvr.json /opt/
CMD clvrbot
