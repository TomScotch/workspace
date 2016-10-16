FROM armhf/ubuntu
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y git make curl gcc gpp g++ build-essential
WORKDIR /root
RUN git clone https://github.com/pjreddie/darknet.git
WORKDIR /root/darknet
RUN make
RUN curl -O http://pjreddie.com/media/files/vgg-conv.weights
#RUN curl -O http://pjreddie.com/media/files/extraction.weights
#RUN curl -O http://pjreddie.com/media/files/alexnet.weights
#RUN curl -O http://pjreddie.com/media/files/strided.weights
EXPOSE 8888
CMD ./darknet nightmare cfg/vgg-conv.cfg vgg-conv.weights /data/image.jpg 10 && mv image_vgg-conv_10_000000.png /data/image.jpg
#ENTRYPOINT ["./darknet nightmare cfg/vgg-conv.cfg vgg-conv.weights","image","layer"]
