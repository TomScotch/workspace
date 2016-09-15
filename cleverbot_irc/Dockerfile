FROM resin/raspberrypi3-node
RUN apt-get update
RUN apt-get upgrade -y
WORKDIR /opt/
RUN apt-get install -y wget nano sudo git
RUN npm install -g cleverbot-irc
COPY .clvr.json /opt/
CMD clvrbot
