FROM nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04
FROM gcr.io/tensorflow/tensorflow:latest-gpu
ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get dist-upgrade -y && \
    apt-get autoremove -y && \
    apt-get autoclean

RUN apt-get update -y &&    \
	apt-get install -y  \
	nano wget curl git  \
	build-essential     \
        ca-certificates     \
        software-properties-common \
	cuda-cublas-8-0 cuda-cublas-dev-8-0 cmake python3-pip ffmpeg openjdk-9-jre-headless openjdk-9-jdk-headless

RUN cd /opt/ ; git clone https://github.com/llSourcell/deepfakes.git

RUN pip3 install -r requirements-gpu.txt

WORKDIR /opt/deepfakes
