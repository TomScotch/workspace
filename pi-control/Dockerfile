FROM armhf/ubuntu
RUN apt-get update
RUN apt-get dist-upgrade -y
RUN apt-get install -y apache2 php5 git wget nano
RUN cd /var/www && git clone https://github.com/harmon25/raspcontrol.git
RUN cd /etc && mkdir raspcontrol && cd raspcontrol
RUN echo '{ \
	"user":       "pi", \
	"password":   "raspberry" \
}' > database.aptmnt
RUN chown www-data:www-data database.aptmnt
RUN chmod 740 database.aptmnt
RUN a2enmod rewrite
EXPOSE 80
CMD service apache2 start
