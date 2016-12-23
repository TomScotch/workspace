FROM node

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get dist-upgrade -y

RUN apt-get update -y &&    \
	apt-get install -y  \
	nano wget curl git  \
           build-essential  \
   locales ca-certificates  \
                  node-gyp  \
software-properties-common

WORKDIR /opt/

RUN npm install monaco-editor -g
RUN npm install monaco-editor-samples
CMD npm run simpleserver
