FROM armhf/ubuntu:16.10
RUN apt-get update && apt-get dist-upgrade -y
RUN apt-get install -y python-mvpa2
RUN mkdir /opt/bin/
COPY bin/ /opt/bin
WORKDIR /opt/bin
RUN apt-get install python-mlpy -y
RUN apt-get install make gpp g++ build-essential coffeescript npm -y
RUN npm install closure
RUN npm install tornado
WORKDIR /opt/bin/bookmarklet/
RUN apt-get install -y python-closure
RUN pip install closure
RUN make
RUN make all 
RUN make install
WORKDIR /opt/bin/

