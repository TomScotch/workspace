#create container
#create.sh
docker create --privileged -v /dev/video0:/dev/video0 --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/}

