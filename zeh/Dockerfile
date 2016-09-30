#dockerfile template
#Dockerfile

FROM armhf/ubuntu

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get dist-upgrade -y
RUN apt-get update -y && \
     apt-get install -y  \
	       nano wget \
	        curl git \
	 build-essential \
	 nodejs npm

RUN cd /opt/ && git clone https://github.com/automata/zeh.git

WORKDIR /opt/zeh

RUN npm install
RUN npm build
