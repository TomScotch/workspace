FROM ubuntu

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get dist-upgrade -y

RUN apt-get update -y &&    \
	apt-get install -y  \
	nano wget curl git  \
	 build-essential    \
locales ca-certificates     \
software-properties-common

RUN useradd -m -r mary
RUN mkdir -p /local/mary
RUN chown mary:mary /local/mary
RUN apt-get update && apt-get install -y git  openjdk-8-jdk maven sudo unzip
RUN sudo -u mary git clone https://github.com/marytts/marytts.git /local/mary/marytts

WORKDIR /local/mary/marytts/

RUN sudo -u mary git fetch --tags
RUN sudo -u mary git checkout v5.2
RUN sudo -u mary mvn package
RUN sudo -u mary mvn install
CMD sudo -u mary sh target/marytts-5.2/bin/marytts-server
EXPOSE 59125

#RUN wget https://github.com/marytts/marytts/releases/download/v5.2/marytts-5.2.zip
#RUN unzip marytts-5.2.zip
#WORKDIR /local/mary/marrytts/marytts-5.2
#RUN ./marytts-component-installer
#RUN ./marytts-server
#RUN ./marytts-client
