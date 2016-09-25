FROM armhf/ubuntu:16.10

RUN apt-get update
RUN apt-get dist-upgrade -y
RUN apt-get upgrade      -y
RUN apt-get autoremove   -y
RUN apt-get autoclean
RUN apt-get install  	\
		nano    \
		wget    \
		git -y

RUN groupadd -r pi -g 433 && \
useradd -u 431 -r -g pi -d <homedir> -s /sbin/nologin -c "Docker image user" pi && \
chown -R pi:pi <homedir>


