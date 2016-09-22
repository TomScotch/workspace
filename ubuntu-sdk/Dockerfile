FROM scotch/base
COPY pgp.key pgp.key
RUN apt-key add pgp.key
RUN echo 'deb http://ppa.launchpad.net/ubuntu-sdk-team/ppa/ubuntu xenial main' >> /etc/apt/sources.list.d/sources.list
RUN apt-get update
RUN apt-get install ubuntu-sdk -y
RUN apt-get install ubuntu-dev-tools -y
RUN apt-get install snapcraft -y
RUN apt-get upgrade -y
RUN snapcraft tour
