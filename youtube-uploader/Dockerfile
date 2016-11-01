FROM armhf/ubuntu:16.10
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get dist-upgrade -y
RUN apt-get update -y && \
apt-get install -y  \
nano wget \
curl git \
build-essential \
python-dev \
python-setuptools 
RUN easy_install httplib2
RUN easy_install pip
RUN pip install --upgrade pip
RUN pip install --upgrade google-api-python-client progressbar2
RUN cd /opt/ && git clone https://github.com/tokland/youtube-upload.git youtube-uploader
WORKDIR /opt/youtube-uploader
RUN python setup.py install
RUN cd /opt/ && git clone https://github.com/httplib2/httplib2.git
RUN cd /opt/httplib2/ && python setup.py install
RUN apt-get install -y python3 python3-dev python3-setuptools python3-httplib2 locales ca-certificates  software-properties-common

#ENV LANGUAGE de_DE.UTF-8
#ENV LC_ALL de_DE.UTF-8
#ENV LANG de_DE.UTF-8
#RUN locale-gen de_DE.UTF-8
#RUN /usr/sbin/update-locale LANG=de_DE.UTF-8
#ENV LANG de_DE.UTF-8

#COPY youtube-upload-credentials.json /root/.youtube-upload-credentials.json
COPY client_secrets.json /opt/youtube-uploader
COPY run-all.sh /opt/youtube-uploader/
COPY update-all.sh /opt/youtube-uploader/
COPY update-single.sh /opt/youtube-uploader/
COPY *.py /opt/youtube-uploader/
