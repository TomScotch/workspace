FROM armhf/ubuntu
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y bundler rake gems
RUN gem install faker
WORKDIR /opt/
ADD *.rb /opt/
