FROM hypriot/rpi-node
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y apt-transport-https wget nano
RUN apt-get install wpasupplicant wireless-tools ssh -y
WORKDIR /opt
EXPOSE 4242
RUN npm install -g http://aka.ms/touchdevelop.tgz
RUN apt install -y sshpass
CMD touchdevelop --cli --internet
