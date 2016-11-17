FROM ubuntu:16.10
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y gcc make pkg-config libasound2-dev sudo git
RUN cd /opt/ && git clone https://github.com/MycroftAI/mimic.git
WORKDIR /opt/mimic
RUN ./configure --with-audio=alsa
RUN make -j 3
RUN mkdir /opt/text/
COPY outfile.sh /opt/
COPY outfile_*.sh /opt/
COPY exec_outfile_*.sh /opt/
