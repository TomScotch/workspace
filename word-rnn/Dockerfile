FROM mbartoli/torch7

ENV DEBIAN_FRONTEND noninteractive
ENV DEBCONF_NONINTERACTIVE_SEEN true

#RUN luarocks install nngraph
#RUN luarocks install nninit
#RUN luarocks install optim
#RUN luarocks install nn
#RUN luarocks install underscore.lua --from=http://marcusirven.s3.amazonaws.com/rocks/
#RUN luarocks install lrexlib-pcre PCRE_LIBDIR=/lib/x86_64-linux-gnu

RUN git clone https://github.com/larspars/word-rnn.git /opt/word-rnn/

WORKDIR /opt/word-rnn/

RUN wget http://nlp.stanford.edu/data/glove.6B.zip
RUN mkdir util/glove
RUN apt-get install -y fastjar
RUN fastjar xvf glove.6B.zip
RUN mv glove.6B.200d.txt util/glove/vectors.6B.200d.txt
RUN rm glove*
