FROM armhf/ubuntu
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y gcc make pkg-config libasound2-dev sudo git
RUN cd /opt/ && git clone https://github.com/MycroftAI/mimic.git
WORKDIR /opt/mimic
RUN ./configure --with-audio=alsa
RUN make
RUN mkdir /opt/text/
ENTRYPOINT ["bin/mimic"]
CMD ["-t greetings my master"]
