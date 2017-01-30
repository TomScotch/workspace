FROM sibuzu/cuda-theano
RUN apt update && apt-get update
#ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && apt-get upgrade -y && apt-get dist-upgrade -y
RUN apt update && apt install -y  nano wget curl git build-essential ca-certificates software-properties-common python-pip python-dev python-setuptools libatlas3-base libatlas-base-dev libatlas-dev  liblapack-dev liblapack3 python-all-dev libfreetype6 libfreetype6-dev libpng12-dev libpng12-0 libxml2 libxml2-dev make gcc g++ gfortran festival* flite unzip zsh csh libblas3 libblas-dev libblas* libprotobuf* python-lxml
RUN easy_install pip
RUN apt-get install -y python-matplotlib python-numpy libncurses5-dev libncurses5 cuda gawk
RUN pip install --upgrade pip
RUN pip install --upgrade bandmat theano tensor keras lasagne scipy
RUN cd /opt/ && git clone https://github.com/CSTR-Edinburgh/merlin.git
WORKDIR /opt/merlin/tools/
RUN wget http://www.festvox.org/packed/festival/2.4/voices/festvox_cmu_us_slt_cg.tar.gz
RUN wget http://www.festvox.org/packed/festival/2.4/speech_tools-2.4-release.tar.gz
RUN wget http://www.festvox.org/packed/festival/2.4/festival-2.4-release.tar.gz
RUN wget http://www.festvox.org/packed/festival/2.4/festlex_CMU.tar.gz
RUN tar xvf festvox_cmu_us_slt_cg.tar.gz
RUN tar xvf speech_tools-2.4-release.tar.gz && tar xvf festival-2.4-release.tar.gz && tar xvf festlex_CMU.tar.gz
RUN cd speech_tools && make all && make install
RUN cd festival && ./configure && make all && make install
RUN sh compile_tools.sh
WORKDIR /opt/merlin/egs/slt_arctic/s1
RUN curl -O http://104.131.174.95/slt_arctic_full_data.zip
#RUN touch experiments/slt_arctic_full/test_synthesis/prompt-lab/tmp
#RUN ./run_full_voice.sh
