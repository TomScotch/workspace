FROM kaixhin/cudnn

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

WORKDIR /opt/

RUN apt-get install -y \
nvidia-cuda-toolkit \
nvidia-cg-toolkit \
nvidia-cuda-dev \
nvidia-common libcg \
libcggl libcuda1-367 \
libnvblas7.5 \
libnvrtc7.5
