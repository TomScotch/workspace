FROM scotch/ruby
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y ruby-all-dev ruby-gsl libgsl0-dev gsl-bin  ruby-lapack liblapacke liblapacke-dev libblas-dev liblapack-dev
WORKDIR /opt
COPY run.rb /opt
RUN gem install fast-stemmer madeleine nmatrix-lapacke nmatrix narray gsl classifier
CMD ruby run.rb
