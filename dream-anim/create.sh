#create container
#create.sh
docker create -v /home/pi/workspace/data/myvideo:/data/myvideo --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/} bash

