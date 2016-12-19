FROM node
RUN apt-get install -y git
RUN cd /opt/ && git clone https://github.com/ajaxorg/ace.git
WORKDIR /opt/ace/
RUN npm install ; node Makefile.dryice.js
EXPOSE 8888
