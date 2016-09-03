FROM armhf/ubuntu:14.04

RUN apt-get update

RUN apt-get install git -y
RUN apt-get install python-pip -y
RUN apt-get install festival -y
RUN apt-get install libjack0 libjack-dev -y
RUN apt-get install portaudio19-dev -y
RUN apt-get install python-all-dev -y

RUN pip install SpeechRecognition
RUN pip install -U nltk

RUN pip install bs4 
RUN pip install wolframalpha

RUN apt-get install python-pyaudio -y
RUN apt-get install git -y 
RUN apt-get install libopencv-dev python-opencv -y

RUN apt-get install autoconf -y
RUN apt-get install bison -y
RUN apt-get install libtool -y
RUN apt-get install swig -y
RUN apt-get install automake -y
RUN apt-get install gcc -y

RUN git clone https://github.com/cmusphinx/sphinxbase
RUN git clone https://github.com/cmusphinx/pocketsphinx

RUN (cd sphinxbase && ./autogen.sh)
RUN (cd sphinxbase && ./configure)
RUN (cd sphinxbase && make)
RUN (cd sphinxbase && make install)

RUN export LD_LIBRARY_PATH=/usr/local/lib
RUN export PKG_CONFIG_PATH=/usr/local/lib/pkgconfig

RUN (cd pocketsphinx && ./autogen.sh)
RUN (cd pocketsphinx && ./configure)
RUN (cd pocketsphinx && make)
RUN (cd pocketsphinx && make install)

RUN git clone https://github.com/camtaylor/alan.git
RUN apt-get install libpocketsphinx-dev -y
RUN pip install pyaudio --upgrade
RUN pip install --upgrade nltk
CMD cd alan && python alan.py
