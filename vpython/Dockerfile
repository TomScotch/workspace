FROM ubuntu:16.10

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get dist-upgrade -y

RUN apt-get update -y &&    \
	apt-get install -y  \
	nano wget curl git  \
	 build-essential    \
locales ca-certificates     \
software-properties-common

RUN locale-gen de_DE.UTF-8
RUN /usr/sbin/update-locale LANG=de_DE.UTF-8
RUN locale-gen de_DE.UTF-8
ENV LANG de_DE.UTF-8

WORKDIR /opt/

##############
#start here
RUN git clone https://github.com/BruceSherwood/vpython-jupyter.git /opt/vpython/
RUN apt-get install -y \
python-pip \
python-setuptools \
python-dev \
unzip
RUN pip install entrypoints
RUN easy_install vpnotebook jupyter
RUN cd vpython && pip install -r requirements.txt
RUN apt-get install -y gcc make g++ cmake ipython-notebook cython
RUN apt-get install -y nodejs npm golang-google-appengine-dev
RUN ln -s /usr/bin/nodejs  /usr/bin/node
RUN cd vpython && python setup.py install
RUN npm install -g bower
RUN git clone https://github.com/BruceSherwood/glowscript.git
RUN apt-get install -y sudo
RUN pip install pip --upgrade && pip install slimit
RUN apt-get update && curl https://sdk.cloud.google.com | bash
RUN cd glowscript && python build_cli.py
#sudo bower install glowscript --allow-root option

#RUN wget https://github.com/BruceSherwood/vpython-jupyter/blob/master/JupyterPythonDemos.zip
#RUN unzip JupyterPythonDemos.zip

#RUN pip install vpnotebook vpython

#
#uncomment to install developer tools
#
#apt-get install deb-multimedia-keyring -y
#echo "deb http://www.deb-multimedia.org jessie main non-free" >> /etc/apt/sources.list
#apt-get update
#apt-get install -y ffmpeg


#uncomment for developer tools 
# javascript python ruby
# npm;node/easy_install/bundler;rake;gems
#RUN apt-get update -y && \
#     apt-get install -y  \
#         build-essential \
#                nodejs npm \
#       python-setuptools \
#              python-dev \
# python-mvpa2 protobuf-c-compiler \
# protobuf-compiler libprotobuf-dev \
# libprotoc9 libprotoc-dev libprotobuf9 \
# python-h5py python-lxml python-matplotlib \
# liblapack-dev python-scipy python-numpy \
# python-imaging python-pil python-sklearn \
# ruby-all-dev bundler gems rake


#uncomment for startup entrypoint or command
#ENTRYPOINT ["bash"]
#CMD bash
#EXPOSE 12345

#uncomment to enable user pi
#RUN mkdir /home/pi
#RUN groupadd -r pi -g 433
#RUN useradd -u 431 -r -g pi -d /home/pi -s /sbin/nologin -c "default" pi
#RUN chown -R pi:pi /home/pi
