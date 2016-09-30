#dockerfile template
#Dockerfile

FROM armhf/ubuntu

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get dist-upgrade -y
RUN apt-get update -y && \
     apt-get install -y  \
	       nano wget \
	        curl git \
	 build-essential \
              python-dev \
       python-setuptools \
          python-twisted \
       python-feedparser \
             python-yaml \
            python-gmpy2

RUN cd /opt/ && git clone https://github.com/otfbot/otfbot.git
WORKDIR /opt/

RUN easy_install otfbot
RUN twistd --help

CMD twistd -n gen-otfbot-config
CMD twistd -n otfbot
