FROM armhf/ubuntu
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y python3-pip
RUN easy_install3 pip
RUN pip install --upgrade pip
RUN apt-get install -y libffi-dev libssl-dev
RUN mkdir /opt/errbot
RUN mkdir /opt/errbot/nit
RUN pip install errbot
WORKDIR /opt/errbot/
COPY config.py /opt/errbot/nit/config.py
RUN /usr/sbin/locale-gen 
RUN mkdir '/var/lib/err'
RUN errbot --init
CMD cd nit && errbot 
