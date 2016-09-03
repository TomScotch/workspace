FROM hypriot/rpi-python
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y gcc make cmake
WORKDIR /opt
COPY . .
RUN python setup.py install
#RUN pip install cobe
CMD cobe
