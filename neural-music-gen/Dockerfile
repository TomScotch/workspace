FROM nvidia/cuda

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get dist-upgrade -y && \
    apt-get autoremove -y && \
    apt-get autoclean

RUN apt-get update -y &&    \
	apt-get install -y  \
	nano wget curl git  \
	build-essential     \
        ca-certificates     \
        software-properties-common

RUN apt-get install -y gcc g++ gfortran build-essential git wget linux-image-generic libopenblas-dev python-dev python-pip python-nose python-numpy python-scipy
RUN wget http://developer.download.nvidia.com/compute/cuda/repos/ubuntu1404/x86_64/cuda-repo-ubuntu1404_7.0-28_amd64.deb
RUN dpkg -i cuda-repo-ubuntu1404_7.0-28_amd64.deb
RUN apt-get update
RUN echo -e "\nexport PATH=/usr/local/cuda/bin:$PATH\n\nexport LD_LIBRARY_PATH=/usr/local/cuda/lib64" >> .bashrc
RUN apt-get update
RUN apt-get -y dist-upgrade
RUN ./cuda-install-samples-7.0.sh ~/cd NVIDIA_CUDA-7.0_Samples/cd 1_Utilities/deviceQuery && make && ./deviceQuery
RUN echo -e "\n[global]\nfloatX=float32\ndevice=gpu\nbase_compiledir=~/external/.theano/\nallow_gc=False\nwarn_float64=warn\n[mode]=FAST_RUN\n\n[nvcc]\nfastmath=True\n\n[cuda]\nroot=/usr/local/cuda\n" >> ~/.theanorc
RUN apt-get install -y python-numpy python-scipy python-dev python-pip python-nose g++ libopenblas-dev git
RUN pip install --upgrade --no-deps git+git://github.com/Theano/Theano.git

RUN apt-get install -y g++-4.9

RUN update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.9 20
RUN update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-5 10

RUN update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-4.9 20
RUN update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-5 10

RUN update-alternatives --install /usr/bin/cc cc /usr/bin/gcc 30
RUN update-alternatives --set cc /usr/bin/gcc

RUN update-alternatives --install /usr/bin/c++ c++ /usr/bin/g++ 30
RUN update-alternatives --set c++ /usr/bin/g++

RUN echo -e "\n[nvcc]\nflags=-D_FORCE_INLINES\n" >> ~/.theanorc
