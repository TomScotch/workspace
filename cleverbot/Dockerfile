FROM armhf/ubuntu
RUN apt-get update
RUN apt-get upgrade -y
WORKDIR /opt/
RUN apt-get install -y wget nano sudo git python3-pip python3-requests
RUN easy_install3 pip
RUN pip install pip --upgrade
RUN pip install cleverbot chatterbot
COPY bot_bot_chat.py /opt/
COPY human_bot_chat.py /opt/
RUN apt-get install -y python-setuptools python-all-dev python-dev binutils build-essential make gpp cmake automake
RUN apt-get install -y python-cobe
CMD python3 bot_bot_chat.py
