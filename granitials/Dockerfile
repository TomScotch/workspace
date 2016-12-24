FROM node

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get dist-upgrade -y

RUN apt-get update -y &&    \
	apt-get install -y  \
	nano wget curl git  \
	 build-essential    \
locales ca-certificates     \
software-properties-common

RUN git clone https://github.com/saadtazi/granitials.git /opt/granitials/
WORKDIR /opt/granitials/
RUN npm install
#RUN node examples/middleware.js
#RUN node examples/generate.js
EXPOSE 3000
