FROM ubuntu
RUN apt-get update
RUN apt-get install -y git nodejs make gcc ruby gems ruby-dev
RUN gem install middleman
EXPOSE 4567
RUN middleman init
RUN middleman build
