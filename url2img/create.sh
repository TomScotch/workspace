nvidia-docker create --net=host -t -i -v /media/scps/:/opt/scps/ --name ${PWD##*/} scotch/${PWD##*/} bash

