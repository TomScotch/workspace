#create container
#create.sh
docker create -v /media/scps/:/opt/txt/ --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/} bash

