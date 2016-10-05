#dockerfile template
#Dockerfile

FROM armhf/ubuntu:16.10

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get dist-upgrade -y
RUN apt-get update -y && \
     apt-get install -y  \
	       nano wget \
	        curl git \
	 build-essential \
                nodejs npm \
       python-setuptools \
              python-dev \
            ruby-all-dev \
       bundler gems rake \
 locales ca-certificates

RUN locale-gen de_DE.UTF-8
RUN /usr/sbin/update-locale LANG=de_DE.UTF-8
RUN locale-gen de_DE.UTF-8
ENV LANG de_DE.UTF-8

RUN cd /opt/ && git clone https://github.com/alexjc/planetwars.git

WORKDIR /opt/planetwars

EXPOSE 4200
RUN easy_install pip
RUN pip install pip --upgrade
RUN pip install gevent gevent-socketio flask
RUN apt-get install -y python-numpy python-scipy
