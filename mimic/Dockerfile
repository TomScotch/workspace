FROM ubuntu
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y gcc make pkg-config libasound2-dev sudo git
RUN cd /opt/ && git clone https://github.com/MycroftAI/mimic.git
WORKDIR /opt/mimic
RUN ./configure --with-audio=alsa
RUN make -j 3
RUN mkdir /opt/text/ && mkdir /opt/mimic/hts/
COPY *.sh /opt/
COPY EnglishHTSVoices /opt/mimic/hts/
RUN cd hts && chmod +x do_build
RUN cd hts && bash do_build
