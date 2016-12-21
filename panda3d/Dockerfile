FROM ubuntu:16.10

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get dist-upgrade -y

RUN apt-get update -y &&    \
	apt-get install -y  \
	nano wget curl git  \
	 build-essential    \
locales ca-certificates     \
software-properties-common

RUN git clone https://github.com/panda3d/panda3d.git /opt/panda3d/
WORKDIR /opt/panda3d/
RUN apt-get install -y build-essential pkg-config python-dev libpng-dev libjpeg-dev libtiff-dev zlib1g-dev libssl-dev libx11-dev libgl1-mesa-dev libxrandr-dev libxxf86dga-dev libxcursor-dev bison flex libfreetype6-dev libvorbis-dev libeigen3-dev libopenal-dev libode-dev libbullet-dev nvidia-cg-toolkit libgtk2.0-dev
RUN apt-get install -y libassimp3v5 python-pyassimp libassimp-dev assimp-utils python-collada opencollada-tools opencollada-dev ffmpeg libswscale-dev libswresample-dev python-fftw fftw-dev fftw2 openexr libcv2.4
RUN python2.7 makepanda/makepanda.py --everything --installer --no-egl --no-gles --no-gles2
RUN  dpkg -i panda3d*.deb
