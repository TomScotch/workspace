FROM armhf/ubuntu
RUN apt-get update
RUN apt-get dist-upgrade -y
RUN apt-get upgrade -y
RUN apt-get autoremove -y
RUN apt-get autoclean
RUN apt-get install -y 	\
		nano \
		wget \
		git
