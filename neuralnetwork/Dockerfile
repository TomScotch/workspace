FROM hypriot/rpi-node
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install nano wget
WORKDIR /opt
COPY . .
RUN npm install
RUN npm install -g --save grunt-cli
RUN grunt build
EXPOSE 9001
CMD grunt serve
