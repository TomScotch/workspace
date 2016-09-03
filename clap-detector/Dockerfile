FROM hypriot/rpi-node
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y sox
RUN npm install --save clap-detector
WORKDIR /opt
COPY run.js .
CMD node run.js
