FROM armhf/alpine:3.4

ARG TOR_VERSION=0.2.8.7
ARG TOR_USER_ID=45553
ARG ARM_VERSION=1.4.5.0

ENV TERM=xterm

RUN BUILD_DEPS=" \
    libevent-dev \
    openssl-dev \
    build-base \
    gnupg \
    ca-certificates" \
 && apk -U add \
    ${BUILD_DEPS} \
    python \
    libevent \
    openssl \
 && cd /tmp \
 && TOR_TARBALL="tor-${TOR_VERSION}.tar.gz" \
 && wget -q https://www.torproject.org/dist/${TOR_TARBALL} \
 && wget -q https://www.torproject.org/dist/${TOR_TARBALL}.asc \
 && echo "All seems good, now unpacking ${TOR_TARBALL}..." \
 && tar xzf ${TOR_TARBALL} && cd tor-${TOR_VERSION} \
 && ./configure --disable-asciidoc && make && make install \
 && adduser -h /var/run/tor -D -s /sbin/nologin -u ${TOR_USER_ID} tor \
 && cd /tmp \
 && ARM_TARBALL="arm-${ARM_VERSION}.tar.bz2" \
 && wget -q https://www.atagar.com/arm/resources/static/${ARM_TARBALL}  \
 && wget -q https://www.atagar.com/arm/resources/static/${ARM_TARBALL}.asc \
 && tar xjf /tmp/${ARM_TARBALL} && cd arm && ./install \
 && apk del ${BUILD_DEPS} \
 && rm -rf /var/cache/apk/* /tmp/* /root/.gnupg

VOLUME /usr/local/etc/tor /tordata
EXPOSE 9001 9030
USER tor

ENTRYPOINT [ "tor" ]
