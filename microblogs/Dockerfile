FROM armhf/ruby

RUN apt update
RUN apt install -y ruby-rails
RUN apt install -y sqlite3

WORKDIR /root/

RUN git clone https://github.com/mhartl/sample_app_3rd_edition.git microblogs

WORKDIR /root/microblogs

RUN apt-get install ruby-all-dev

RUN bundle install --without production
RUN bundle exec rake db:migrate
RUN bundle exec rake db:migrate RAILS_ENV=test

EXPOSE 81

CMD rails server -p 81 -b 0.0.0.0
