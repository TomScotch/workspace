FROM scotch/base
RUN ln -s /usr/bin/nodejs /usr/bin/node

RUN git clone https://github.com/sass/libsass.git /opt/libsass
RUN cd /opt/libsass/ && make && make install

RUN git clone https://github.com/harp/harpjs.com /opt/harp
RUN cd /opt/harp/ && npm install node-sass
RUN cd /opt/harp/ && npm install
RUN cd /opt/harp/ && npm install -g harp
RUN harp init mysite
WORKDIR /opt/harp/
EXPOSE 9000
CMD npm start
