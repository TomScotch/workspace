FROM armhf/ubuntu
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y git nodejs npm
RUN cd /root && git clone https://github.com/qiciengine/qiciengine.git
WORKDIR /root/qiciengine
EXPOSE 80
RUN npm install
CMD node ./editorservice/StartService.js --publish
