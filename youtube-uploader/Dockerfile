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
	  build-essential\
		python-dev python-setuptools

RUN easy_install pip

RUN pip install --upgrade pip

RUN pip install --upgrade google-api-python-client progressbar2

RUN cd /opt/ && git clone https://github.com/tokland/youtube-upload.git

WORKDIR /opt/youtube-upload

RUN python setup.py install
COPY client_secrets.json /opt/
