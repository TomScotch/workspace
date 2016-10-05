#create container
#create.sh
docker create --device=/dev/hidraw0/:/dev/hidraw0/ -t -i --name ${PWD##*/} scotch/${PWD##*/}

