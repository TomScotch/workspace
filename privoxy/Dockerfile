FROM armhf/ubuntu:16.10
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y privoxy
EXPOSE 8118
CMD /etc/init.d/privoxy start && bash
