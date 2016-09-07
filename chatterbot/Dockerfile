FROM armhf/ubuntu
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install python-pip wget nano -y
RUN pip install -r https://raw.githubusercontent.com/gunthercox/ChatterBot/master/requirements.txt
RUN pip install chatterbot
WORKDIR /opt/
RUN wget https://raw.githubusercontent.com/gunthercox/ChatterBot/master/examples/terminal_example.py
COPY train.py /opt/
COPY example.py /opt/
RUN apt-get install -y python-levenshtein
RUN python -m textblob.download_corpora
RUN python train.py
RUN apt-get install pocketsphinx -y
RUN pip install chatterbot-voice
CMD python terminal_example.py
#CMD python example.py #use for voicechat
