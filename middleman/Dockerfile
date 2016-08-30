FROM hypriot/rpi-ruby

RUN apt-get update

RUN apt-get install -y git nodejs make gcc

RUN gem install middleman

WORKDIR /opt

EXPOSE 4567

RUN middleman init

RUN middleman build

CMD middleman server
