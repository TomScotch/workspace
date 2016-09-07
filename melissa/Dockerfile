FROM armhf/debian
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y sudo nano git python-pip mpg123 espeak --fix-missing
RUN apt-get install -y libsphinxbase-dev libsphinxbase1 libpocketsphinx1 libpocketsphinx-dev sphinxbase-utils pocketsphinx-hmm-en-hub4wsj  libsphinxbase-dev libpocketsphinx-dev sphinxbase-utils sphinx-common pocketsphinx
WORKDIR /opt
RUN git clone https://github.com/Melissa-AI/Melissa-Core.git melissa
WORKDIR /opt/melissa
RUN apt-get install -y python-dev
RUN apt-get install -y --upgrade python-pip swig
RUN easy_install tweepy sox
RUN apt-get install -y portaudio19-dev
RUN pip install -r requirements.txt
RUN easy_install $(cat requirements.txt)
RUN apt install wget -y
RUN ./setup/travis-build-core.sh
RUN python -m textblob.download_corpora
CMD python main.py
