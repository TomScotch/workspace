FROM ubuntu
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y git nano wget nodejs npm
RUN cd /opt/ && git clone https://github.com/codeinthedark/editor.git
WORKDIR /opt/editor/
RUN npm install --global gulp-cli
#RUN gulp build
RUN npm install
CMD ./node_modules/.bin/gulp serve
