FROM armhf/ubuntu:16.10
RUN apt-get update && apt-get dist-upgrade -y
COPY bin/ /opt/
WORKDIR /opt/bin/
CMD bash
