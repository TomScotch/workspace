FROM ubuntu
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y sudo nano git python-pip mpg123 espeak --fix-missing
RUN apt-get install -y libsphinxbase-dev libsphinxbase3 libpocketsphinx3 libpocketsphinx-dev sphinxbase-utils sphinx-voxforge-hmm-en libsphinxbase-dev libpocketsphinx-dev sphinxbase-utils sphinx-common pocketsphinx --fix-missing
WORKDIR /opt
RUN git clone https://github.com/Melissa-AI/Melissa-Core.git melissa
WORKDIR /opt/melissa
RUN apt-get install -y python-dev
RUN apt-get install -y --upgrade python-pip swig
RUN easy_install tweepy sox
RUN apt-get install -y portaudio19-dev
RUN for f in $(cat requirements.txt) ; do easy_install $f ; done
RUN apt install wget -y
RUN ./setup/travis-build-core.sh
RUN pip install -U textblob
RUN python -m textblob.download_corpora
CMD python main.py
