FROM resin/raspberrypi3-node
RUN cd /opt/ && git clone https://github.com/electron/electron
WORKDIR /opt/electron
RUN npm install
CMD npm start
