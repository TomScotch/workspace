nvidia-docker create --net=host -t -i --name ${PWD##*/} scotch/${PWD##*/} bash && r2d2

