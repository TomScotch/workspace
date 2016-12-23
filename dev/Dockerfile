# Nodejs
# Python
# Ruby
# Java


FROM ubuntu

RUN apt-get update && apt-get install -y --no-install-recommends \

ca-certificates \

curl \

wget \

&& rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y --no-install-recommends \

bzr \

git \

mercurial \

openssh-client \

subversion \

\

procps \

&& rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y --no-install-recommends \

autoconf \

automake \

bzip2 \

file \

g++ \

gcc \

imagemagick \

libbz2-dev \

libc6-dev \

libcurl4-openssl-dev \

libdb-dev \

libevent-dev \

libffi-dev \

libgdbm-dev \

libgeoip-dev \

libglib2.0-dev \

libjpeg-dev \

libkrb5-dev \

liblzma-dev \

libmagickcore-dev \

libmagickwand-dev \

libmysqlclient-dev \

libncurses-dev \

libpng-dev \

libpq-dev \

libreadline-dev \

libsqlite3-dev \

libssl-dev \

libtool \

libwebp-dev \

libxml2-dev \

libxslt-dev \

libyaml-dev \

make \

patch \

xz-utils \

zlib1g-dev \

&& rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y \

ca-certificates \

curl

# verify gpg and sha256: http://nodejs.org/dist/v0.10.30/SHASUMS256.txt.asc

# gpg: aka "Timothy J Fontaine (Work) <tj.fontaine@joyent.com>"

RUN gpg --keyserver pool.sks-keyservers.net --recv-keys 7937DFD2AB06298B2293C3187D33FF9D0246406D

ENV NODE_VERSION 0.11.14

ENV NPM_VERSION 2.1.18

RUN curl -SLO "http://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz" \

&& curl -SLO "http://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \

&& gpg --verify SHASUMS256.txt.asc \

&& grep " node-v$NODE_VERSION-linux-x64.tar.gz\$" SHASUMS256.txt.asc | sha256sum -c - \

&& tar -xzf "node-v$NODE_VERSION-linux-x64.tar.gz" -C /usr/local --strip-components=1 \

&& rm "node-v$NODE_VERSION-linux-x64.tar.gz" SHASUMS256.txt.asc \

&& npm install -g npm@"$NPM_VERSION" \

&& npm cache clear

RUN mkdir -p /usr/local/etc \

&& { \

echo 'install: --no-document'; \

echo 'update: --no-document'; \

} >> /usr/local/etc/gemrc



ENV RUBY_MAJOR 2.4-rc

ENV RUBY_VERSION 2.4.0-preview3

ENV RUBY_DOWNLOAD_SHA256 c35fe752ccfabf69bf48e6aab5111c25a05938b428936f780638e2111934c9dd

ENV RUBYGEMS_VERSION 2.6.8



# some of ruby's build scripts are written in ruby

#   we purge system ruby later to make sure our final image uses what we just built

RUN set -ex \

\

&& buildDeps=' \

bison \

libgdbm-dev \

ruby \

' \

&& apt-get update \

&& apt-get install -y --no-install-recommends $buildDeps \

&& rm -rf /var/lib/apt/lists/* \

\

&& wget -O ruby.tar.gz "https://cache.ruby-lang.org/pub/ruby/${RUBY_MAJOR%-rc}/ruby-$RUBY_VERSION.tar.gz" \

&& echo "$RUBY_DOWNLOAD_SHA256 *ruby.tar.gz" | sha256sum -c - \

\

&& mkdir -p /usr/src/ruby \

&& tar -xzf ruby.tar.gz -C /usr/src/ruby --strip-components=1 \

&& rm ruby.tar.gz \

\

&& cd /usr/src/ruby \

\

# hack in "ENABLE_PATH_CHECK" disabling to suppress:

#   warning: Insecure world writable dir

&& { \

echo '#define ENABLE_PATH_CHECK 0'; \

echo; \

cat file.c; \

} > file.c.new \

&& mv file.c.new file.c \

\

&& autoconf \

&& ./configure --disable-install-doc --enable-shared \

&& make -j"$(nproc)" \

&& make install \

\

&& apt-get purge -y --auto-remove $buildDeps \

&& cd / \

&& rm -r /usr/src/ruby \

\

&& gem update --system "$RUBYGEMS_VERSION"



ENV BUNDLER_VERSION 1.13.6



RUN gem install bundler --version "$BUNDLER_VERSION"



# install things globally, for great justice

# and don't create ".bundle" in all our apps

ENV GEM_HOME /usr/local/bundle

ENV BUNDLE_PATH="$GEM_HOME" \

BUNDLE_BIN="$GEM_HOME/bin" \

BUNDLE_SILENCE_ROOT_WARNING=1 \

BUNDLE_APP_CONFIG="$GEM_HOME"

ENV PATH $BUNDLE_BIN:$PATH

RUN mkdir -p "$GEM_HOME" "$BUNDLE_BIN" \

&& chmod 777 "$GEM_HOME" "$BUNDLE_BIN"

# ensure local python is preferred over distribution python

ENV PATH /usr/local/bin:$PATH



# http://bugs.python.org/issue19846

# > At the moment, setting "LANG=C" on a Linux system *fundamentally breaks Python 3*, and that's not OK.

ENV LANG C.UTF-8



# runtime dependencies

RUN apt-get update && apt-get install -y --no-install-recommends \

tcl \

tk \

&& rm -rf /var/lib/apt/lists/*



ENV GPG_KEY C01E1CAD5EA2C4F0B8E3571504C367C218ADD4FF

ENV PYTHON_VERSION 2.7.12



# if this is called "PIP_VERSION", pip explodes with "ValueError: invalid truth value '<VERSION>'"

ENV PYTHON_PIP_VERSION 9.0.1



RUN set -ex \

&& buildDeps=' \

tcl-dev \

tk-dev \

' \

&& apt-get update && apt-get install -y $buildDeps --no-install-recommends && rm -rf /var/lib/apt/lists/* \

\

&& wget -O python.tar.xz "https://www.python.org/ftp/python/${PYTHON_VERSION%%[a-z]*}/Python-$PYTHON_VERSION.tar.xz" \

&& wget -O python.tar.xz.asc "https://www.python.org/ftp/python/${PYTHON_VERSION%%[a-z]*}/Python-$PYTHON_VERSION.tar.xz.asc" \

&& export GNUPGHOME="$(mktemp -d)" \

&& gpg --keyserver ha.pool.sks-keyservers.net --recv-keys "$GPG_KEY" \

&& gpg --batch --verify python.tar.xz.asc python.tar.xz \

&& rm -r "$GNUPGHOME" python.tar.xz.asc \

&& mkdir -p /usr/src/python \

&& tar -xJC /usr/src/python --strip-components=1 -f python.tar.xz \

&& rm python.tar.xz \

\

&& cd /usr/src/python \

&& ./configure \

--enable-shared \

--enable-unicode=ucs4 \

&& make -j$(nproc) \

&& make install \

&& ldconfig \

\

&& wget -O /tmp/get-pip.py 'https://bootstrap.pypa.io/get-pip.py' \

&& python2 /tmp/get-pip.py "pip==$PYTHON_PIP_VERSION" \

&& rm /tmp/get-pip.py \

# we use "--force-reinstall" for the case where the version of pip we're trying to install is the same as the version bundled with Python

# ("Requirement already up-to-date: pip==8.1.2 in /usr/local/lib/python3.6/site-packages")

# https://github.com/docker-library/python/pull/143#issuecomment-241032683

&& pip install --no-cache-dir --upgrade --force-reinstall "pip==$PYTHON_PIP_VERSION" \

# then we use "pip list" to ensure we don't have more than one pip version installed

# https://github.com/docker-library/python/pull/100

&& [ "$(pip list |tac|tac| awk -F '[ ()]+' '$1 == "pip" { print $2; exit }')" = "$PYTHON_PIP_VERSION" ] \

\

&& find /usr/local -depth \

\( \

\( -type d -a -name test -o -name tests \) \

-o \

\( -type f -a -name '*.pyc' -o -name '*.pyo' \) \

\) -exec rm -rf '{}' + \

&& apt-get purge -y --auto-remove $buildDeps \

&& rm -rf /usr/src/python ~/.cache



# install "virtualenv", since the vast majority of users of this image will want it

RUN pip install --no-cache-dir virtualenv

# add a simple script that can auto-detect the appropriate JAVA_HOME value

# based on whether the JDK or only the JRE is installed

RUN { \

echo '#!/bin/sh'; \

echo 'set -e'; \

echo; \

echo 'dirname "$(dirname "$(readlink -f "$(which javac || which java)")")"'; \

} > /usr/local/bin/docker-java-home \

&& chmod +x /usr/local/bin/docker-java-home



ENV JAVA_HOME /usr/lib/jvm/java-9-openjdk-amd64



ENV JAVA_VERSION 9~b147

ENV JAVA_DEBIAN_VERSION 9~b147-1



RUN set -x \

&& apt-get update \

&& apt-get install -y \

openjdk-9-jre-headless \

&& rm -rf /var/lib/apt/lists/* \

&& [ "$JAVA_HOME" = "$(docker-java-home)" ]


# add a simple script that can auto-detect the appropriate JAVA_HOME value

# based on whether the JDK or only the JRE is installed

RUN { \

echo '#!/bin/sh'; \

echo 'set -e'; \

echo; \

echo 'dirname "$(dirname "$(readlink -f "$(which javac || which java)")")"'; \

} > /usr/local/bin/docker-java-home \

&& chmod +x /usr/local/bin/docker-java-home



ENV JAVA_HOME /usr/lib/jvm/java-9-openjdk-amd64



ENV JAVA_VERSION 9~b147

ENV JAVA_DEBIAN_VERSION 9~b147-1



RUN set -x \

&& apt-get update \

&& apt-get install -y \

openjdk-9-jdk-headless \

&& rm -rf /var/lib/apt/lists/* \

&& [ "$JAVA_HOME" = "$(docker-java-home)" ]

WORKDIR /opt/
