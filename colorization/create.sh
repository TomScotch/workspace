nvidia-docker create --net=host -v ~/data/:/data/ -t -i --name ${PWD##*/} scotch/${PWD##*/} bash

