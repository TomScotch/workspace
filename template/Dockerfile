#dockerfile template
#Dockerfile

FROM armhf/ubuntu:16.10

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get dist-upgrade -y
RUN apt-get update -y && \
     apt-get install -y  \
	       nano wget \
	        curl git \
	 build-essential \
                node npm \
       python-setuptools \
              python-dev \
            ruby-all-dev \
       bundler gems rake \
                 ffmmpeg \
          python-opencv2 \
 locales ca-certificates

RUN locale-gen DE.UTF-8
RUN /usr/sbin/update-locale LANG=de_DE.UTF-8
RUN locale-gen DE.UTF-8
ENV LANG de_DE.UTF-8

WORKDIR /opt/

#ENTRYPOINT ["bash"]
#CMD bash

#EXPOSE 12345

RUN mkdir /home/pi
RUN groupadd -r pi -g 433
RUN useradd -u 431 -r -g pi -d /home/pi -s /sbin/nologin -c "default" pi
RUN chown -R pi:pi /home/pi
