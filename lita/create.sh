#create container
#create.sh

docker create -v /home/pi/workspace/${PWD##*/}/scripts/:/opt/scripts -t -i --name ${PWD##*/} scotch/${PWD##*/}
