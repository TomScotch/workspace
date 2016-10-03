FROM scotch/ruby
WORKDIR /opt
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y redis-server wget nano git
RUN git clone https://github.com/litaio/lita.git
WORKDIR /opt/lita
RUN gem install bundle
RUN bundle
RUN bundle install
RUN gem build lita.gemspec
RUN gem install lita-5.0.0.gem
COPY Gemfile /opt/lita/
COPY lita_config.rb /opt/lita
RUN apt-get install -y libcurl3 curl libghc-curl-dev
RUN gem install curb -v '0.9.3'
RUN gem install lita-slack
RUN bundle install
RUN bundle update
CMD redis-server > /dev/null & lita start
