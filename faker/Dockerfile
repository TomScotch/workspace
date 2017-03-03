FROM ubuntu
RUN apt-get update && apt-get install -y bundler rake gems
RUN gem install faker
RUN mkdir /opt/scripts/
WORKDIR /opt/
