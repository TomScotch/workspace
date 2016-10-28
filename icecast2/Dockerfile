FROM armhf/ubuntu
ENV DEBIAN_FRONTEND noninteractive
ENV ICECAST_SOURCE_PASSWORD=source
ENV ICECAST_ADMIN_PASSWORD=admin
ENV ICECAST_PASSWORD=icecast
ENV ICECAST_RELAY_PASSWORD=relay
RUN apt-get -qq -y update && \
    apt-get -qq -y install icecast2 python-setuptools && \
    apt-get clean
RUN easy_install supervisor && \
    easy_install supervisor-stdout
EXPOSE 8000
VOLUME ["/config", "/var/log/icecast2", "/etc/icecast2"]
ADD ic2/start.sh /start.sh
ADD ic2/etc /etc
RUN chown -R icecast2 /etc/icecast2
CMD bash start.sh
