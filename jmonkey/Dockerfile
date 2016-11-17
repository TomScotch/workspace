FROM ubuntu
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y ant git libandroidsdk-common-java libandroidsdk-sdklib-java 
RUN cd /opt/ && git clone https://github.com/jMonkeyEngine/jmonkeyengine.git jme3
RUN apt-get install -y openjdk-8-jdk openjdk-8-jre
WORKDIR /opt/
RUN mkdir HelloJME3
RUN mkdir HelloJME3/src
RUN mkdir HelloJME3/src/hello
RUN mkdir HelloJME3/build
RUN mkdir HelloJME3/lib
COPY HelloJME3.java /opt/HelloJME3/src/hello/
RUN cp jme3/lib/* HelloJME3/lib
WORKDIR /opt/HelloJME3/
RUN javac -d build -cp "lib/eventbus-1.4.jar:lib/j-ogg-oggd.jar:lib/j-ogg-vorbisd.jar:lib/jME3-lwjgl-natives.jar:lib/jbullet.jar:lib/jinput.jar:lib/lwjgl.jar:lib/stack-alloc.jar:lib/vecmath.jar:lib/xmlpull-xpp3-1.1.4c.jar:lib/jME3-blender.jar:lib/jME3-core.jar:lib/jME3-desktop.jar:lib/jME3-jogg.jar:lib/jME3-plugins.jar:lib/jME3-terrain.jar:lib/jME3-testdata.jar:lib/jME3-niftygui.jar:lib/nifty-default-controls.jar:lib/nifty-examples.jar:lib/nifty-style-black.jar:lib/nifty.jar:." src/hello/HelloJME3.java
RUN cd build && java -cp "../lib/eventbus-1.4.jar:../lib/j-ogg-oggd.jar:../lib/j-ogg-vorbisd.jar:../lib/jME3-lwjgl-natives.jar:../lib/jbullet.jar:../lib/jinput.jar:../lib/lwjgl.jar:../lib/stack-alloc.jar:../lib/vecmath.jar:../lib/xmlpull-xpp3-1.1.4c.jar:../lib/jME3-blender.jar:../lib/jME3-core.jar:../lib/jME3-desktop.jar:../lib/jME3-jogg.jar:../lib/jME3-plugins.jar:../lib/jME3-terrain.jar:../lib/jME3-testdata.jar:../lib/jME3-niftygui.jar:../lib/nifty-default-controls.jar:../lib/nifty-examples.jar:../lib/nifty-style-black.jar:../lib/nifty.jar:." hello/HelloJME3
CMD bash
