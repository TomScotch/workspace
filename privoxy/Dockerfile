FROM armhf/ubuntu
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y privoxy
EXPOSE 8118
CMD service privoxy start && bash
