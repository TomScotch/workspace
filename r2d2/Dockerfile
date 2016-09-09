FROM armhf/ubuntu
RUN apt update
RUN apt upgrade -y
RUN apt install -y 
ENTRYPOINT ['speaker-test -Dplug:front -c1 -f ']
