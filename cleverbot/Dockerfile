FROM resin/raspberrypi3-node
RUN apt-get update
RUN apt-get upgrade -y
WORKDIR /opt/
RUN npm install --save cleverbot.io 
RUN git clone https://github.com/CleverbotIO/node-cleverbot.io cleverbot
COPY example.js /opt/cleverbot/cleverbot.js
CMD cd /opt/cleverbot && node cleverbot.js
