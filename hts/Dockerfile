FROM ubuntu
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y gcc make pkg-config libasound2-dev sudo git
RUN mkdir /opt/text/ && mkdir /opt/hts/
COPY *.sh /opt/
COPY EnglishHTSVoices /opt/hts/
WORKDIR /opt/hts/
RUN bash do_build
