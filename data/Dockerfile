FROM armhf/ubuntu:16.10
RUN apt-get update
RUN apt-get install -y python
WORKDIR /opt
EXPOSE 99
CMD python -m SimpleHTTPServer 99
