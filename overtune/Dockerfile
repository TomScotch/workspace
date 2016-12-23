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
 
RUN cd /opt/ && git clone git://github.com/overtone/overtone.git
WORKDIR /opt/overtone/

RUN add-apt-repository ppa:supercollider/ppa
RUN apt-get update
RUN apt-get install supercollider -y

RUN echo "Etc/UTC" | tee /etc/timezone ; dpkg-reconfigure --frontend noninteractive tzdata
RUN apt-get update
RUN apt-get install -y python-software-properties curl git vim locales apt-file ca-certificates less manpages manpages-dev openssh-client sudo
RUN echo "LANG=en_US.UTF-8" | tee /etc/default/locale ; dpkg-reconfigure --frontend noninteractive locales
RUN add-apt-repository -y ppa:webupd8team/java
RUN apt-get update
RUN echo debconf shared/accepted-oracle-license-v1-1 select true | debconf-set-selections
RUN echo debconf shared/accepted-oracle-license-v1-1 seen true | debconf-set-selections
RUN apt-get -y install oracle-java7-installer 
RUN cd /usr/bin/ && wget https://raw.github.com/technomancy/leiningen/stable/bin/lein
RUN chmod 0755 /usr/bin/lein
RUN export LEIN_ROOT="ok" ; /usr/bin/lein upgrade
ENV LEIN_ROOT "ok"
RUN lein deps
RUN apt-get install jack -y
