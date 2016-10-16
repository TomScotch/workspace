FROM armhf/ubuntu

RUN apt-get update
RUN apt-get upgrade -y

RUN apt-get install -y libandroidsdk-sdklib-java libandroidsdk-common-java openjdk-8-jdk openjdk-8-jre nodejs npm

RUN npm install -g cordova

WORKDIR /opt

RUN cordova create app de.tomscotch.app app

WORKDIR /opt/app

RUN cordova platform add android

#RUN cordova build ubuntu
#CMD cordova run ubuntu

CMD bash
