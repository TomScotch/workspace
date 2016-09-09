FROM hypriot/rpi-node
RUN apt update
RUN apt upgrade -y
RUN apt install -y wget git nano  libgtk2.0-common
RUN apt-get update &&\
    apt-get install -y libgtk2.0-0 libgconf-2-4 \
    libasound2 libxtst6 libxss1 libnss3 xvfb
RUN cd /opt/ && git clone https://github.com/zeit/hyperterm.git
WORKDIR /opt/hyperterm
#RUN npm install electron -g
RUN apt install -y p7zip build-essential binutils cpp make gpp icnsutils graphicsmagick xz-utils
#RUN npm install --save rage-power
RUN npm install
#CMD npm start
