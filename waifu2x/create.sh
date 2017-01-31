nvidia-docker create -v /media/scps/:/media/scps/ --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/} bash

