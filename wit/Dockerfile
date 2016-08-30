FROM armhf/debian
RUN apt-get update
RUN apt-get upgrade -y
WORKDIR /opt
COPY witd-armv6  witd
RUN apt install libsox2 -y
RUN apt install libssl1.0.0 libssl-dev -y
EXPOSE 9877
CMD ./witd HOST=0.0.0.0 PORT=9877 -e true
