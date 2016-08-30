FROM armhf/debian:wheezy
RUN apt-get update
RUN apt-get upgrade -y

#RUN apt install wget git -y
#RUN wget https://gist.githubusercontent.com/TomScotch/77e515cdd09b784953950ea8642e9f82/raw/66793ed53e7e26830147762ca213c50b50182038/ffmpeg.sh && chmod +x ffmpeg.sh && ./ffmpeg.sh

RUN apt-get install -y motion nano
EXPOSE 8081
COPY motion.conf /etc/motion/
CMD motion -n
