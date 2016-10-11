#start container
#start.sh

docker run -d=true -p=25565:25565 --name ${PWD##*/} -v=/home/pi/workspace/minecraft-server/data/:/data scotch/${PWD##*/} /start
