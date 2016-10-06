FROM armhf/ubuntu
RUN apt-get update && apt-get install -y software-properties-common git wget curl nano 
RUN cd /opt/ && git clone https://github.com/tensorflow/magenta.git
WORKDIR /opt/magenta/
RUN apt-get update && \
apt-get install -y \
python-setuptools python-dev python-protobuf \
python-mvpa2 protobuf-c-compiler \
protobuf-compiler libprotobuf-dev \
libprotoc-dev python-h5py python-lxml \
python-matplotlib liblapack-dev python-scipy \ 
python-numpy python-imaging python-pil python-sklearn sudo \
pkg-config zip g++ zlib1g-dev unzip

RUN echo "deb [arch=armhf] http://storage.googleapis.com/bazel-apt stable jdk1.8" | sudo tee /etc/apt/sources.list.d/bazel.list
RUN curl https://storage.googleapis.com/bazel-apt/doc/apt-key.pub.gpg | sudo apt-key add -

RUN apt-get install oracle-java8-installer -y

RUN cd /opt/ && git clone https://github.com/wtfuzz/bazel.git
WORKDIR /opt/bazel/



RUN bash compile.sh
RUN cd /opt/ && wget http://download.magenta.tensorflow.org/models/basic_rnn.mag && wget http://download.magenta.tensorflow.org/models/lookback_rnn.mag && wget http://download.magenta.tensorflow.org/models/attention_rnn.mag
EXPOSE 8888
