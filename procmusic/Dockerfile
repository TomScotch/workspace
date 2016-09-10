FROM resin/raspberrypi3-python
RUN apt update
RUN apt upgrade -y
RUN apt install -y git nano wget python-numpy
RUN pip install encoder
COPY procmusic.py /opt/
CMD  python /opt/procmusic.py
