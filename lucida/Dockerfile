FROM ubuntu:14.04
RUN apt-get update && \
apt-get upgrade -y && \
apt-get dist-upgrade -y && \
apt-get autoremove -y && \
apt-get autoclean
RUN apt-get install -y git make
RUN cd /opt/ && git clone https://github.com/claritylab/lucida.git
WORKDIR /opt/lucida/tools/
COPY install_thrift.sh /opt/lucida/tools/
COPY install_opencv.sh /opt/lucida/tools/
WORKDIR /opt/lucida/tools/
RUN ./apt_deps.sh
RUN ./install_python.sh
RUN ./install_java.sh
RUN ./install_opencv.sh
RUN ./install_thrift.sh
RUN ./install_fbthrift.sh
RUN ./install_mongodb.sh

#RUN cd /opt/lucida/lucida && make
RUN cd /opt/lucida/lucida/questionanswering/OpenEphyra && rm build.xml && wget https://raw.githubusercontent.com/TScottJ/OpenEphyra/master/build.xml && make

#RUN cd /opt/lucida/tools/ && ./download_wiki_index.sh
#RUN echo "export wiki_indri_index=$(pwd)/wiki_indri_index" >> /root/.bashrc
#WORKDIR /opt/lucida/
