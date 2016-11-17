FROM ubuntu
RUN apt update
RUN apt upgrade -y
RUN apt install -y git nano wget python-pip
RUN pip install --upgrade pip
RUN apt install -y python-pyaudio
RUN pip install playsound wave
RUN apt install -y libwavpack-dev python-pygame
WORKDIR /opt/
