FROM resin/raspberrypi3-node
RUN apt-get update
RUN apt-get upgrade -y
#RUN apt-get install -y git nano wget
#RUN cd /opt && git clone https://github.com/Gottox/node-webterm.git webterm
#WORKDIR /opt/webterm
RUN cd /opt && npm install tty.js --global --save
EXPOSE 3000
#COPY config.json config.json
CMD cd /opt && tty.js --port 3000 --damonize
