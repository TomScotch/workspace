FROM armhf/alpine:3.4

ENV NODE_VERSION 6.2.0-r0
ENV NPM_VERSION 3.9.5

WORKDIR /root
RUN apk add --no-cache nodejs=${NODE_VERSION} && \
  if [ -x /usr/bin/npm ]; then \
    npm install -g npm@${NPM_VERSION} && \
    find /usr/lib/node_modules/npm -name test -o -name .bin -type d | xargs rm -rf; \
  fi && \
  rm -rf /tmp/* /root/.npm /usr/lib/node_modules/npm/man /usr/lib/node_modules/npm/doc \
    /usr/lib/node_modules/npm/html
