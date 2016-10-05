FROM armhf/ubuntu:16.10

# Install dependencies
RUN apt-get -qq update           &&  \
    apt-get -qq install --assume-yes \
        "build-essential"            \
	"gcc"			     \
	"g++"			     \
	"gfortran"		     \
	"build-essential"	     \
	"git"			     \ 
	"wget"			     \
        "libopenblas-dev"	     \ 
        "cmake"                      \
        "git"                        \
        "wget"                       \
        "libopenjpeg5"               \
        "libopenblas-dev"            \
        "liblapack-dev"              \
        "libjpeg-dev"                \
        "libtiff5-dev"               \
        "zlib1g-dev"                 \
        "libfreetype6-dev"           \
        "liblcms2-dev"               \
        "libwebp-dev"                \
        "gfortran"                   \
        "pkg-config"                 \
        "python3"                    \
        "python3-dev"                \
	"python3-scipy"		     \
        "python3-pip"                \
        "python3-numpy"              \
        "python3-scipy"              \
        "python3-six"                \
        "python3-networkx"       &&  \
    rm -rf /var/lib/apt/lists/*  &&  \
         easy_install3 cython
#RUN pip install --user --upgrade --no-deps https://github.com/Theano/Theano/archive/master.zip
#RUN pip install --user --upgrade --no-deps https://github.com/Lasagne/Lasagne/archive/master.zip
RUN cd /opt/ && git clone https://github.com/alexjc/neural-doodle.git doodle
WORKDIR /opt/doodle/
RUN wget -q "https://github.com/alexjc/neural-doodle/releases/download/v0.0/vgg19_conv.pkl.bz2"
RUN python3 -m pip install --ignore-installed -r requirements.txt
