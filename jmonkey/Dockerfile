FROM armhf/ubuntu
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y ant git libandroidsdk-common-java libandroidsdk-sdklib-java 
RUN cd /opt/ && git clone https://github.com/jMonkeyEngine/jmonkeyengine.git
RUN apt-get install -y openjdk-8-jdk openjdk-8-jre
CMD bash
