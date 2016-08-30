FROM resin/raspberrypi3-node
WORKDIR /root
COPY . .
EXPOSE 80
RUN npm install
CMD node ./editorservice/StartService.js --publish
