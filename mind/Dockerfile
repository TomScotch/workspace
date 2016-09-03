FROM hypriot/rpi-node
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y nano git wget sudo make
WORKDIR /opt
COPY . .
RUN npm install browserify -g
RUN make
RUN npm install -g
CMD bash

