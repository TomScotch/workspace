nvidia-docker create -v ${PWD}:/data -v /media/scps/:/media/scps/ --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/} bash

