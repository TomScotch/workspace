FROM ubuntu
RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get dist-upgrade -y
RUN apt-get autoremove -y
RUN apt-get autoclean
RUN apt-get install git wget nano python-pip -y
COPY index.html /opt
WORKDIR /opt
EXPOSE 1122
EXPOSE 8000
CMD python -m SimpleHTTPServer
