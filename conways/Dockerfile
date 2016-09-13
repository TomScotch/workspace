FROM armhf/ubuntu
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install nano sudo git wget nodejs npm -y
RUN cd /opt/ && git clone https://github.com/wwwtyro/conway3d.js.git conways
WORKDIR /opt/conways
RUN npm install browserify --global
CMD browserify
