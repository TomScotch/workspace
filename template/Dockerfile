#dockerfile template
#Dockerfile

FROM armhf/ubuntu

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get dist-upgrade -y
RUN apt-get update -y && \
     apt-get install -y  \
	       nano wget \
	        curl git \
	  build-essential

RUN mkdir /home/pi
RUN groupadd -r pi -g 433
RUN useradd -u 431 -r -g pi -d /home/pi -s /sbin/nologin -c "default" pi
RUN chown -R pi:pi /home/pi

WORKDIR /opt/

#ENTRYPOINT ["bash"]
CMD bash

#EXPOSE 12345
