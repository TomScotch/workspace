FROM armhf/ubuntu
RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get dist-upgrade -y
RUN apt full-upgrade -y
RUN apt-get autoremove -y
RUN apt-get autoclean
RUN apt-get install git wget nano nodejs npm -y
RUN git clone https://github.com/nodejs/github-bot.git /opt/bot
WORKDIR /opt/bot
RUN npm install
EXPOSE 3000
CMD npm start
