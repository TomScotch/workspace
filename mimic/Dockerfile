FROM ubuntu
RUN apt-get update
RUN apt-get upgrade -y
RUN apt update ; apt-get install -y gcc make pkg-config libasound2-dev sudo git gcc make pkg-config automake libtool wget
RUN cd /opt/ && git clone https://github.com/MycroftAI/mimic.git
WORKDIR /opt/mimic
RUN apt install unzip -y
RUN ./dependencies.sh --prefix="/usr/local"
RUN ./autogen.sh
RUN ./configure --prefix="/usr/local"
RUN make
RUN make check
RUN mkdir /opt/text/ && mkdir /opt/mimic/hts/
COPY *.sh /opt/
COPY EnglishHTSVoices /opt/mimic/hts/
RUN cd hts && chmod +x do_build
RUN cd hts && bash do_build
