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

RUN cd /opt/ && git clone https://github.com/tokland/youtube-upload.git youtube-uploader

WORKDIR /opt/youtube-uploader

RUN python setup.py install

COPY client_secrets.json /opt/youtube-uploader
COPY run-all.sh /opt/youtube-uploader/
COPY update-all.sh /opt/youtube-uploader/
COPY update-single.sh /opt/youtube-uploader/
COPY *.py /opt/youtube-uploader/

RUN pip install httplib2
