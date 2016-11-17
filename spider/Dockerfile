#dockerfile template
#Dockerfile

FROM ubuntu

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get dist-upgrade -y
RUN apt-get update -y && \
     apt-get install -y  \
	       nano wget \
	        curl git \
	 build-essential \
       python-setuptools \
   python-dev python-pip 

WORKDIR /opt/

RUN wget https://pypi.python.org/packages/86/ea/8e9fbce5c8405b9614f1fd304f7109d9169a3516a493ce4f7f77c39435b7/beautifulsoup4-4.5.1.tar.gz
RUN tar xfz beautifulsoup4-4.5.1.tar.gz
RUN mv beautifulsoup4-4.5.1 beautifulsoup4
WORKDIR /opt/beautifulsoup4/
RUN python setup.py build 
RUN python setup.py install 
COPY crawler.py /opt/beautifulsoup4/
ENTRYPOINT ["python","crawler.py"]
CMD ["-d","1","http://www.scp-wiki.net/scp-series-1"]
CMD ["-d","1","http://www.scp-wiki.net/scp-series-2"]
CMD ["-d","1","http://www.scp-wiki.net/scp-series-3"]
