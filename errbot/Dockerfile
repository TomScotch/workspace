FROM resin/rpi-raspbian

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y python3-pip python3-all-dev python3-dev
RUN easy_install3 pip
RUN pip install --upgrade pip
RUN apt-get install -y libffi-dev libssl-dev make gcc cpp
RUN mkdir /opt/errbot
RUN mkdir /opt/errbot/nit
RUN mkdir '/var/lib/err'
RUN pip install --upgrade setuptools
RUN easy_install errbot

WORKDIR /opt/errbot/

COPY config.py /opt/errbot/nit/config.py

RUN export C_CTYPE="de_DE.UTF-8"
RUN export LANG=de_DE.UTF-8
RUN apt-get install -y locales
RUN echo "Europe/Berlin" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata
RUN echo 'LANG="de_DE.UTF-8"'>/etc/default/locale
RUN locale-gen de de_DE de_DE.UTF-8
RUN dpkg-reconfigure --frontend=noninteractive locales
RUN update-locale 

RUN errbot --init
CMD cd nit && errbot 
