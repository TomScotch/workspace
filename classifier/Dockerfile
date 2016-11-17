FROM ubuntu
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y ruby-all-dev ruby-gsl libgsl0-dev gsl-bin
WORKDIR /opt
COPY run.rb /opt
RUN gem install fast-stemmer madeleine narray gsl classifier
CMD ruby run.rb
