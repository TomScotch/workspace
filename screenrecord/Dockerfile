FROM armhf/ubuntu
RUN apt-get update
RUN apt-get upgrade
RUN apt-get install -y libx264-dev
CMD avconv -f x11grab -r 25 -s 1920x1080 -i :0.0 -vcodec libx264 screencast.flv 
