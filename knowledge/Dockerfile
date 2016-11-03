FROM armhf/ubuntu:trusty

RUN apt-get update -y
RUN apt-get install -y dirmngr
######################################################################################################################################################
# Set up Java(lastest)
######################################################################################################################################################

RUN apt-get update -y
RUN apt-get install -y default-jre default-jdk python-pip
RUN pip install dumb-init

######################################################################################################################################################
# Set up Tomcat
######################################################################################################################################################
RUN apt-get update && \
    apt-get install -yq --no-install-recommends wget pwgen ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV TOMCAT_MAJOR_VERSION 8
ENV TOMCAT_MINOR_VERSION 8.5.5
ENV CATALINA_HOME /tomcat

# INSTALL TOMCAT
RUN wget -q https://archive.apache.org/dist/tomcat/tomcat-${TOMCAT_MAJOR_VERSION}/v${TOMCAT_MINOR_VERSION}/bin/apache-tomcat-${TOMCAT_MINOR_VERSION}.tar.gz && \
    wget -qO- https://archive.apache.org/dist/tomcat/tomcat-${TOMCAT_MAJOR_VERSION}/v${TOMCAT_MINOR_VERSION}/bin/apache-tomcat-${TOMCAT_MINOR_VERSION}.tar.gz.md5 | md5sum -c - && \
    tar zxf apache-tomcat-*.tar.gz && \
    rm apache-tomcat-*.tar.gz && \
    mv apache-tomcat* /tomcat

RUN chmod -R 777 /tomcat/webapps

RUN \
  apt-get update && \
  apt-get autoremove -y && \
  apt-get clean allEXPOSE 8080

# ==== environment ====
RUN rm -rf /tomcat/webapps/ROOT \
  && update-ca-certificates -f \
  && chmod +x /usr/local/bin/dumb-init


######################################################################################################################################################
# Set up Tomcat
######################################################################################################################################################
EXPOSE 8080
# Define default command.
CMD [ "/usr/local/bin/dumb-init", "/tomcat/bin/catalina.sh", "run" 
