FROM ubuntu
RUN apt update && apt-get upgrade -y && apt-get dist-upgrade -y
RUN apt install -y ruby-rails git sqlite3  ruby-dev build-essential libsqlite3-dev gcc ruby-dev libxslt-dev libxml2-dev patch zlib1g-dev liblzma-dev pkg-config
WORKDIR /opt/
RUN git clone https://github.com/tomscotch/sample_app_3rd_edition.git microblogs
WORKDIR /opt/microblogs
RUN bundle config build.nokogiri --use-system-libraries
RUN bundle install --without production
RUN bundle exec rake db:migrate
RUN bundle exec rake db:migrate RAILS_ENV=test
RUN bundle exec rake db:seed
EXPOSE 81
CMD rails server -p 81 -b 0.0.0.0
