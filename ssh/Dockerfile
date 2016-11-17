FROM ubuntu
RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get dist-upgrade -y
RUN apt full-upgrade -y
RUN apt-get autoremove -y
RUN apt-get autoclean
RUN apt-get install ssh -y
CMD service ssh start
