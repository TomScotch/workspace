nvidia-docker create --net=host -t -i -v ${PWD}:/opt/data --name ${PWD##*/} scotch/${PWD##*/} bash 

