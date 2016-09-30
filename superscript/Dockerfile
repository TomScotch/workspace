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

RUN cd /opt/ && git clone https://github.com/superscriptjs/superscript.git

WORKDIR /opt/superscript/

RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN npm install wordnet-db
RUN npm install superscript -g
RUN cd /opt/ && bot-init mybot --client telnet

WORKDIR /opt/mybot/

RUN npm install
RUN npm update

CMD bash

#RUN cd topics && \
#touch main.ss && \
#echo " \
#+ hello world \
#- Hi from your bot." > main.ss && \
#				    parse
#CMD nodejs server.js

