FROM armhf/ubuntu
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get dist-upgrade -y
RUN apt-get update && apt-get install -y git python make g++ npm nodejs build-essential
RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN npm install -g harp
RUN mkdir hello-world
RUN cd hello-world && echo h1 Hello World >> index.jade
EXPOSE 9009
ENTRYPOINT ["harp","server","--port","9009"]
