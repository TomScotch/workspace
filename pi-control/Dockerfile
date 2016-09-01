FROM resin/rpi-raspbian
RUN apt-get update
RUN apt-get install lighttpd php5-cgi php5-fpm php5-mcrypt libssh2-1-dev libssh2-php
RUN lighty-enable-mod fastcgi
RUN lighty-enable-mod fastcgi-php
RUN service php5-fpm restart
RUN service lighttpd start
ENV DEBIAN_FRONTEND noninteractive
RUN curl http://picontrol.willy-tech.de/picontrol_installer | bash
CMD bash $(passw root)
