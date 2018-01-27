FROM ubuntu

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
RUN apt-get install -y python-pip
RUN pip install conda
RUN cd /opt/ && git clone https://github.com/alexjc/neural-enhance.git neural-enhancer
WORKDIR /opt/neural-enhancer/
RUN mkdir /opt/neural-enhancer/pics/
RUN export LC_ALL=en_US.UTF-8
RUN apt-get install -y \
gcc g++ gfortran build-essential \
git wget libopenblas-dev python-dev python-pip python-nose \
python-numpy python-scipy  python3-pip python3-dev cython3 \
libblas-dev libopenblas-dev libghc-zlib-dev

RUN pip install pip --upgrade
RUN pip3 install --user --upgrade --no-deps https://github.com/Lasagne/Lasagne/archive/master.zip
### download and compile the JPEG library
RUN wget http://www.ijg.org/files/jpegsrc.v8c.tar.gz && tar xvfz jpegsrc.v8c.tar.gz && cd jpeg-8c && ./configure --enable-shared --prefix=$CONFIGURE_PREFIX && make && make install
### link the libraries correctly - RASPBERRY PI ONLY
RUN ln -s /usr/lib/arm-linux-gnueabi/libjpeg.so /usr/lib
RUN ln -s /usr/lib/arm-linux-gnueabi/libfreetype.so /usr/lib
RUN ln -s /usr/lib/arm-linux-gnueabi/libz.so /usr/lib
### install rest of the libraries, as well as freetrype and zlib
RUN apt-get install -y libjpeg-dev libfreetype6 libfreetype6-dev zlib1g-dev
### re-install PIL
RUN pip3 install pillow
RUN python3 -m pip install --ignore-installed -r requirements.txt
RUN pip3 install --user --upgrade --no-deps https://github.com/Theano/Theano/archive/master.zip
RUN wget https://github.com/alexjc/neural-doodle/releases/download/v0.0/vgg19_conv.pkl.bz2
# Setup the alias. Put this in your .bashrc or .zshrc file so it's available at startup.
RUN alias enhance='function ne() { docker run --rm -v "$(pwd)/`dirname ${@:$#}`":/ne/input -it alexjc/neural-enhance ${@:1:-1} "input/`basename ${@:$#}`"; }; ne'

# Now run any of the examples above using this alias, without the `.py` extension.
# enhance --zoom=1 --model=small images/example.jpg
RUN wget https://github.com/alexjc/neural-enhance/releases/download/v0.3/ne1x-photo-deblur-0.3.pkl.bz2
RUN wget https://github.com/alexjc/neural-enhance/releases/download/v0.3/ne1x-photo-repair-0.3.pkl.bz2
RUN wget https://github.com/alexjc/neural-enhance/releases/download/v0.3/ne2x-photo-default-0.3.pkl.bz2
RUN wget https://github.com/alexjc/neural-enhance/releases/download/v0.3/ne4x-photo-default-0.3.pkl.bz2
