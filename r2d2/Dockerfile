FROM armhf/ubuntu
RUN apt update
RUN apt upgrade -y
RUN apt install -y git nano wget python-pip
RUN pip install --upgrade pip
RUN apt install -y python-pyaudio python-pyglet
COPY . /opt/
CMD cd /opt/ && python r2d2.py
