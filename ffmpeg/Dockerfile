FROM debian
RUN apt-get update && \
	apt-get upgrade -y && \
	apt-get dist-upgrade -y && \
	apt-get autoremove -y && \
	apt-get autoclean
	apt-get install deb-multimedia-keyring -y && \
	echo "deb http://www.deb-multimedia.org jessie main non-free" >> /etc/apt/sources.list && \
	apt-get update && \
	apt-get install -y ffmpeg

