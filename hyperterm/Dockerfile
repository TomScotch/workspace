FROM resin/raspberrypi3-node
RUN apt update
RUN apt upgrade -y
RUN apt install -y wget git nano
RUN cd /opt/ && git clone https://github.com/zeit/hyperterm.git
WORKDIR /opt/hyperterm
RUN npm install
RUN npm start
