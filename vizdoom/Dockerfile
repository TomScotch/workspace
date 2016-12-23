FROM ubuntu
RUN apt-get update && apt-get install -y build-essential zlib1g-dev libsdl2-dev libjpeg-dev nasm tar libbz2-dev libgtk2.0-dev cmake git libfluidsynth-dev libgme-dev libopenal-dev timidity libwildmidi-dev default-jdk cmake make gcc lua5.1 python-pip python3-pip libboost-all-dev
RUN pip install numpy && pip3 install numpy
RUN cd /opt/ && git clone https://github.com/Marqt/ViZDoom.git
WORKDIR /opt/ViZDoom/
RUN apt-get install -y liblua5.1-0 liblua5.1-0-dev default-jre
RUN apt-get install -y wget unzip
RUN cmake -DCMAKE_BUILD_TYPE=Release -DBUILD_PYTHON=ON -DBUILD_JAVA=OFF -DBUILD_LUA=ON && make
