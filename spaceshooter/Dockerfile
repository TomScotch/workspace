FROM scotch/base
RUN apt-get update
RUN apt-get install curl sudo
RUN curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
RUN apt-get update && apt-get dist-upgrade -y && apt-get install -y nodejs git nano wget
RUN git clone https://github.com/deepstreamIO/ds-demo-spaceshooter.git /opt/spaceshooter/
WORKDIR /opt/spaceshooter/
RUN npm install
RUN npm install webpack-dev-server webpack jquery pixi.js
RUN apt-get install -y bundler
COPY package.json /opt/spaceshooter/
CMD npm run start 
